from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from django.http import JsonResponse
from django.db import connection
from .views import (
    LocationTokenObtainPairView,
    UserViewSet,
    JimboViewSet,
    MtaaViewSet,
    ChurchViewSet,
    EvangelismRecordViewSet,
    OfferingTypeViewSet,
    OfferingViewSet,
    change_password,
    dashboard_stats,
    generate_report,
)

router = DefaultRouter()
router.register("users", UserViewSet)
router.register("jimbo", JimboViewSet)
router.register("mitaa", MtaaViewSet)
router.register("churches", ChurchViewSet)
router.register("evangelism", EvangelismRecordViewSet)
router.register("offering-types", OfferingTypeViewSet)
router.register("offerings", OfferingViewSet)

def health_check(request):
    """Health check endpoint for deployment monitoring"""
    try:
        # Check database connection
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        
        return JsonResponse({
            "status": "healthy",
            "database": "connected",
            "service": "YESAYA Ministry Backend"
        })
    except Exception as e:
        return JsonResponse({
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(e)
        }, status=503)

urlpatterns = [
    path("health/", health_check, name="health_check"),
    path("auth/login/", LocationTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("auth/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("change-password/", change_password),
    path("dashboard-stats/", dashboard_stats),
    path("reports/generate/", generate_report),
    path("", include(router.urls)),
]
