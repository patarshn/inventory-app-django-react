from django.db import models
from django.contrib.auth.models import AbstractBaseUser,PermissionsMixin,BaseUserManager

# Create your CustomUserManager here.
class CustomUserManager(BaseUserManager):
    def _create_user(self, username, password, first_name, last_name, **extra_fields):
        if not username:
            raise ValueError("Username must be provided")
        if not password:
            raise ValueError('Password is not provided')

        user = self.model(
            username = username,
            first_name = first_name,
            last_name = last_name,
            **extra_fields
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, username, password, first_name, last_name, **extra_fields):
        extra_fields.setdefault('is_staff',True)
        extra_fields.setdefault('is_active',True)
        extra_fields.setdefault('is_superuser',False)
        extra_fields.setdefault('role','user')
        return self._create_user(username, password, first_name, last_name, **extra_fields)

    def create_superuser(self, username, password, first_name, last_name, **extra_fields):
        extra_fields.setdefault('is_staff',True)
        extra_fields.setdefault('is_active',True)
        extra_fields.setdefault('is_superuser',True)
        extra_fields.setdefault('role','admin')
        return self._create_user(username, password, first_name, last_name, **extra_fields)

# Create your User Model here.
class User(AbstractBaseUser,PermissionsMixin):
    # Abstractbaseuser has password, last_login, is_active by default

    username = models.CharField(db_index=True, unique=True, max_length=254)
    first_name = models.CharField(max_length=240)
    last_name = models.CharField(max_length=255)
    role = models.CharField(max_length=50)

    is_staff = models.BooleanField(default=True) # must needed, otherwise you won't be able to loginto django-admin.
    is_active = models.BooleanField(default=True) # must needed, otherwise you won't be able to loginto django-admin.
    is_superuser = models.BooleanField(default=False) # this field we inherit from PermissionsMixin.

    objects = CustomUserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['first_name','last_name','role']

    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'