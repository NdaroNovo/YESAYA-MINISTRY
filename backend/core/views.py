from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from django.db.models import Sum, Count
from .models import Jimbo, Mtaa, Church, EvangelismRecord, OfferingType, Offering, AuditLog
from .serializers import (
    UserSerializer,
    JimboSerializer,
    MtaaSerializer,
    ChurchSerializer,
    EvangelismRecordSerializer,
    OfferingTypeSerializer,
    OfferingSerializer,
)
from .permissions import IsSuperAdmin, IsJimboAdmin, IsMtaaLeader, IsChurchLeader, IsViewer
from .middleware import AuditLogMiddleware

User = get_user_model()


def read_only_or(permission_class):
    """Return IsViewer for safe actions, otherwise the supplied role permission."""
    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            return [IsViewer()]
        return [permission_class()]
    return get_permissions


class LocationTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        request = self.context.get("request")
        user = self.user
        if request:
            ip = AuditLogMiddleware.get_client_ip(request)
            lat, lng = AuditLogMiddleware.get_client_location(request)
            user.last_login_ip = ip
            user.last_login_latitude = lat
            user.last_login_longitude = lng
            user.save(update_fields=["last_login_ip", "last_login_latitude", "last_login_longitude"])
            AuditLog.objects.create(
                user=user,
                action="LOGIN",
                path="/api/auth/login/",
                ip_address=ip,
                latitude=lat,
                longitude=lng,
                description="User logged in",
            )
        data["user"] = {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role,
            "phone": user.phone,
            "assigned_mtaa": user.assigned_mtaa_id,
            "assigned_church": user.assigned_church_id,
            "use_location": user.use_location,
        }
        return data


class LocationTokenObtainPairView(TokenObtainPairView):
    serializer_class = LocationTokenObtainPairSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.select_related("assigned_mtaa", "assigned_church").all()
    serializer_class = UserSerializer
    permission_classes = [IsJimboAdmin]

    def get_permissions(self):
        if self.action in ["retrieve", "me"]:
            return [IsAuthenticated()]
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [IsSuperAdmin()]
        return super().get_permissions()

    @action(detail=False, methods=["get"], url_path="me")
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)


class JimboViewSet(viewsets.ModelViewSet):
    queryset = Jimbo.objects.all()
    serializer_class = JimboSerializer
    permission_classes = [IsJimboAdmin]
    get_permissions = read_only_or(IsJimboAdmin)


class MtaaViewSet(viewsets.ModelViewSet):
    queryset = Mtaa.objects.filter(is_active=True).select_related("jimbo")
    serializer_class = MtaaSerializer
    permission_classes = [IsMtaaLeader]
    get_permissions = read_only_or(IsMtaaLeader)
    pagination_class = None

    def get_queryset(self):
        user = self.request.user
        qs = self.queryset
        jimbo_id = self.request.query_params.get("jimbo")
        if jimbo_id:
            qs = qs.filter(jimbo_id=jimbo_id)
        if user.role == "mtaa_leader" and user.assigned_mtaa:
            return qs.filter(id=user.assigned_mtaa_id)
        return qs


class ChurchViewSet(viewsets.ModelViewSet):
    queryset = Church.objects.filter(is_active=True).select_related("mtaa", "mtaa__jimbo")
    serializer_class = ChurchSerializer
    permission_classes = [IsChurchLeader]
    get_permissions = read_only_or(IsChurchLeader)
    pagination_class = None

    def get_queryset(self):
        user = self.request.user
        qs = self.queryset
        mtaa_id = self.request.query_params.get("mtaa")
        if mtaa_id:
            qs = qs.filter(mtaa_id=mtaa_id)
        if user.role == "church_leader" and user.assigned_church:
            return qs.filter(id=user.assigned_church_id)
        if user.role == "mtaa_leader" and user.assigned_mtaa:
            return qs.filter(mtaa_id=user.assigned_mtaa_id)
        return qs


class EvangelismRecordViewSet(viewsets.ModelViewSet):
    queryset = EvangelismRecord.objects.select_related("church", "church__mtaa").all()
    serializer_class = EvangelismRecordSerializer
    permission_classes = [IsChurchLeader]
    get_permissions = read_only_or(IsChurchLeader)

    def get_queryset(self):
        user = self.request.user
        qs = self.queryset
        mtaa_id = self.request.query_params.get("mtaa")
        church_id = self.request.query_params.get("church")
        search = self.request.query_params.get("search")
        month = self.request.query_params.get("month")
        year = self.request.query_params.get("year")
        
        if mtaa_id:
            qs = qs.filter(church__mtaa_id=mtaa_id)
        if church_id:
            qs = qs.filter(church_id=church_id)
        if search:
            qs = qs.filter(church__name__icontains=search)
        if month:
            qs = qs.filter(month=month)
        if year:
            qs = qs.filter(year=year)
        if user.role == "church_leader" and user.assigned_church:
            return qs.filter(church_id=user.assigned_church_id)
        if user.role == "mtaa_leader" and user.assigned_mtaa:
            return qs.filter(church__mtaa_id=user.assigned_mtaa_id)
        return qs


class OfferingTypeViewSet(viewsets.ModelViewSet):
    queryset = OfferingType.objects.filter(is_active=True)
    serializer_class = OfferingTypeSerializer
    permission_classes = [IsJimboAdmin]
    get_permissions = read_only_or(IsJimboAdmin)


class OfferingViewSet(viewsets.ModelViewSet):
    queryset = Offering.objects.select_related("church", "church__mtaa", "offering_type").all()
    serializer_class = OfferingSerializer
    permission_classes = [IsChurchLeader]
    get_permissions = read_only_or(IsChurchLeader)

    def get_queryset(self):
        user = self.request.user
        qs = self.queryset
        mtaa_id = self.request.query_params.get("mtaa")
        church_id = self.request.query_params.get("church")
        search = self.request.query_params.get("search")
        offering_type = self.request.query_params.get("offering_type")
        month = self.request.query_params.get("month")
        year = self.request.query_params.get("year")
        
        if mtaa_id:
            qs = qs.filter(church__mtaa_id=mtaa_id)
        if church_id:
            qs = qs.filter(church_id=church_id)
        if search:
            qs = qs.filter(church__name__icontains=search)
        if offering_type:
            qs = qs.filter(offering_type_id=offering_type)
        if month:
            qs = qs.filter(month=month)
        if year:
            qs = qs.filter(year=year)
        if user.role == "church_leader" and user.assigned_church:
            return qs.filter(church_id=user.assigned_church_id)
        if user.role == "mtaa_leader" and user.assigned_mtaa:
            return qs.filter(church__mtaa_id=user.assigned_mtaa_id)
        return qs


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def change_password(request):
    user = request.user
    current = request.data.get("current_password")
    new = request.data.get("new_password")
    if not user.check_password(current):
        return Response({"detail": "Nenosiri la sasa si sahihi."}, status=status.HTTP_400_BAD_REQUEST)
    user.set_password(new)
    user.save()
    AuditLog.objects.create(user=user, action="UPDATE", path="/api/change-password", description="Password changed")
    return Response({"detail": "Nenosiri limebadilishwa."})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    from django.utils import timezone
    from datetime import datetime, timedelta
    
    time_period = request.query_params.get("period", "all")
    
    # Base querysets
    church_qs = Church.objects.filter(is_active=True)
    evangelism_qs = EvangelismRecord.objects.all()
    offering_qs = Offering.objects.all()
    
    # Apply time-based filters
    now = timezone.now()
    
    if time_period == "week":
        week_ago = now - timedelta(days=7)
        evangelism_qs = evangelism_qs.filter(created_at__gte=week_ago)
        offering_qs = offering_qs.filter(created_at__gte=week_ago)
    elif time_period == "month":
        month_ago = now - timedelta(days=30)
        evangelism_qs = evangelism_qs.filter(created_at__gte=month_ago)
        offering_qs = offering_qs.filter(created_at__gte=month_ago)
    elif time_period == "year":
        year_ago = now - timedelta(days=365)
        evangelism_qs = evangelism_qs.filter(created_at__gte=year_ago)
        offering_qs = offering_qs.filter(created_at__gte=year_ago)
    # "all" shows all data without filtering
    
    church_stats = church_qs.aggregate(
        total_members=Sum("member_count"),
        total_churches=Count("id"),
    )
    evangelism_stats = evangelism_qs.aggregate(
        total_baptized=Sum("baptized"),
        total_converted=Sum("converted"),
        total_visited=Sum("visited"),
        total_supported=Sum("supported"),
    )
    offering_stats = offering_qs.aggregate(
        total_offerings=Sum("amount"),
        church_share=Sum("church_share"),
        field_share=Sum("field_share"),
    )

    return Response({
        "period": time_period,
        "total_mitaa": Mtaa.objects.filter(is_active=True).count(),
        "total_churches": church_stats["total_churches"] or 0,
        "total_members": church_stats["total_members"] or 0,
        "total_baptized": evangelism_stats["total_baptized"] or 0,
        "total_converted": evangelism_stats["total_converted"] or 0,
        "total_visited": evangelism_stats["total_visited"] or 0,
        "total_supported": evangelism_stats["total_supported"] or 0,
        "total_offerings": offering_stats["total_offerings"] or 0,
        "church_share": offering_stats["church_share"] or 0,
        "field_share": offering_stats["field_share"] or 0,
    })


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def generate_report(request):
    report_type = request.query_params.get("type", "all")
    
    data = {}
    
    if report_type in ["all", "churches"]:
        churches = Church.objects.filter(is_active=True).select_related("mtaa", "mtaa__jimbo")
        data["churches"] = [
            {
                "id": c.id,
                "name": c.name,
                "pastor_name": c.pastor_name,
                "phone": c.phone,
                "address": c.address,
                "member_count": c.member_count,
                "mtaa": c.mtaa.name,
                "jimbo": c.mtaa.jimbo.name,
                "created_at": c.created_at.isoformat() if c.created_at else None,
            }
            for c in churches
        ]
    
    if report_type in ["all", "mitaa"]:
        mitaa = Mtaa.objects.filter(is_active=True).select_related("jimbo")
        data["mitaa"] = [
            {
                "id": m.id,
                "name": m.name,
                "leader_name": m.leader_name,
                "phone": m.phone,
                "location": m.location,
                "jimbo": m.jimbo.name,
                "church_count": m.churches.filter(is_active=True).count(),
                "created_at": m.created_at.isoformat() if m.created_at else None,
            }
            for m in mitaa
        ]
    
    if report_type in ["all", "jimbo"]:
        jimbo_list = Jimbo.objects.all()
        data["jimbo"] = [
            {
                "id": j.id,
                "name": j.name,
                "district": j.district,
                "region": j.region,
                "phone": j.phone,
                "email": j.email,
                "address": j.address,
                "mtaa_count": j.mitaa.filter(is_active=True).count(),
                "created_at": j.created_at.isoformat() if j.created_at else None,
            }
            for j in jimbo_list
        ]
    
    if report_type in ["all", "offerings"]:
        offerings = Offering.objects.select_related("church", "church__mtaa", "offering_type")
        data["offerings"] = [
            {
                "id": o.id,
                "church": o.church.name,
                "mtaa": o.church.mtaa.name,
                "offering_type": o.offering_type.name,
                "amount": float(o.amount),
                "church_share": float(o.church_share),
                "field_share": float(o.field_share),
                "month": o.month,
                "year": o.year,
                "created_at": o.created_at.isoformat() if o.created_at else None,
            }
            for o in offerings
        ]
    
    if report_type in ["all", "evangelism"]:
        evangelism = EvangelismRecord.objects.select_related("church", "church__mtaa")
        data["evangelism"] = [
            {
                "id": e.id,
                "church": e.church.name,
                "mtaa": e.church.mtaa.name,
                "month": e.month,
                "year": e.year,
                "baptized": e.baptized,
                "converted": e.converted,
                "visited": e.visited,
                "supported": e.supported,
                "comments": e.comments,
                "created_at": e.created_at.isoformat() if e.created_at else None,
            }
            for e in evangelism
        ]
    
    return Response(data)
