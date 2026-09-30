from django.contrib import admin
from django.urls import include, path

from . import views

admin.site.site_header = 'Friendship Radio Administration'

urlpatterns = [
    path('', views.index, name='index'),
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
]
