from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Jimbo, Mtaa, Church, EvangelismRecord, EvangelismCustomField, OfferingType, Offering

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    assigned_mtaa_name = serializers.CharField(source="assigned_mtaa.name", read_only=True, default=None)
    assigned_church_name = serializers.CharField(source="assigned_church.name", read_only=True, default=None)

    class Meta:
        model = User
        fields = [
            "id", "username", "email", "full_name", "role", "phone",
            "assigned_mtaa", "assigned_mtaa_name", "assigned_church", "assigned_church_name",
            "is_active", "use_location",
            "last_login_latitude", "last_login_longitude", "last_login_ip",
        ]
        read_only_fields = [
            "id", "assigned_mtaa_name", "assigned_church_name",
            "last_login_latitude", "last_login_longitude", "last_login_ip",
        ]


class JimboSerializer(serializers.ModelSerializer):
    class Meta:
        model = Jimbo
        fields = "__all__"


class MtaaSerializer(serializers.ModelSerializer):
    jimbo_name = serializers.CharField(source="jimbo.name", read_only=True)
    church_count = serializers.SerializerMethodField()

    class Meta:
        model = Mtaa
        fields = [
            "id", "jimbo", "jimbo_name", "name", "leader_name", "phone", "location",
            "is_active", "church_count", "created_at", "updated_at",
        ]

    def get_church_count(self, obj):
        return obj.churches.filter(is_active=True).count()


class ChurchSerializer(serializers.ModelSerializer):
    mtaa_name = serializers.CharField(source="mtaa.name", read_only=True)
    jimbo_name = serializers.CharField(source="mtaa.jimbo.name", read_only=True)

    class Meta:
        model = Church
        fields = [
            "id", "mtaa", "mtaa_name", "jimbo_name", "name", "pastor_name", "phone",
            "address", "member_count", "is_active", "created_at", "updated_at",
        ]


class EvangelismCustomFieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = EvangelismCustomField
        fields = ["id", "label", "value"]


class EvangelismRecordSerializer(serializers.ModelSerializer):
    custom_fields = EvangelismCustomFieldSerializer(many=True, required=False)
    church_name = serializers.CharField(source="church.name", read_only=True)
    mtaa_name = serializers.CharField(source="church.mtaa.name", read_only=True)
    mtaa_id = serializers.IntegerField(source="church.mtaa_id", read_only=True)

    class Meta:
        model = EvangelismRecord
        fields = [
            "id", "church", "church_name", "mtaa_id", "mtaa_name",
            "recorded_by", "month", "year",
            "baptized", "converted", "visited", "supported",
            "comments", "evidence", "custom_fields", "created_at", "updated_at",
            "latitude", "longitude", "location_accuracy", "location_captured_at",
        ]
        read_only_fields = [
            "recorded_by", "church_name", "mtaa_id", "mtaa_name",
            "created_at", "updated_at", "location_captured_at",
        ]

    def _set_location_timestamp(self, validated_data):
        if validated_data.get("latitude") and validated_data.get("longitude"):
            from django.utils import timezone
            validated_data["location_captured_at"] = timezone.now()
        return validated_data

    def create(self, validated_data):
        custom_fields_data = validated_data.pop("custom_fields", [])
        validated_data["recorded_by"] = self.context["request"].user
        validated_data = self._set_location_timestamp(validated_data)
        record = super().create(validated_data)
        for field_data in custom_fields_data:
            EvangelismCustomField.objects.create(record=record, **field_data)
        return record

    def update(self, instance, validated_data):
        custom_fields_data = validated_data.pop("custom_fields", None)
        validated_data = self._set_location_timestamp(validated_data)
        record = super().update(instance, validated_data)
        if custom_fields_data is not None:
            record.custom_fields.all().delete()
            for field_data in custom_fields_data:
                EvangelismCustomField.objects.create(record=record, **field_data)
        return record


class OfferingTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = OfferingType
        fields = "__all__"

    def validate(self, data):
        cp = data.get("church_percentage", 0)
        fp = data.get("field_percentage", 0)
        if cp + fp != 100:
            raise serializers.ValidationError("Asilimia za Kanisa na Jimbo lazima ziwe jumla 100%.")
        return data


class OfferingSerializer(serializers.ModelSerializer):
    church_name = serializers.CharField(source="church.name", read_only=True)
    mtaa_name = serializers.CharField(source="church.mtaa.name", read_only=True)
    mtaa_id = serializers.IntegerField(source="church.mtaa_id", read_only=True)
    offering_type_name = serializers.CharField(source="offering_type.name", read_only=True)

    class Meta:
        model = Offering
        fields = [
            "id", "church", "church_name", "mtaa_id", "mtaa_name",
            "offering_type", "offering_type_name", "amount", "church_share", "field_share",
            "month", "year", "notes", "recorded_by", "created_at", "updated_at",
            "latitude", "longitude", "location_accuracy", "location_captured_at",
        ]
        read_only_fields = [
            "church_share", "field_share", "recorded_by",
            "church_name", "mtaa_id", "mtaa_name", "offering_type_name",
            "created_at", "updated_at", "location_captured_at",
        ]

    def create(self, validated_data):
        validated_data["recorded_by"] = self.context["request"].user
        if validated_data.get("latitude") and validated_data.get("longitude"):
            from django.utils import timezone
            validated_data["location_captured_at"] = timezone.now()
        return super().create(validated_data)

    def update(self, instance, validated_data):
        if validated_data.get("latitude") and validated_data.get("longitude"):
            from django.utils import timezone
            validated_data["location_captured_at"] = timezone.now()
        return super().update(instance, validated_data)
