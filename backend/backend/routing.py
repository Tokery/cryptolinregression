from channels.routing import ProtocolTypeRouter, URLRouter
from api.channels import DataConsumer
from django.conf.urls import url

url_patterns = [
    url(r'^$', DataConsumer)
]

application = ProtocolTypeRouter({
    'websocket': URLRouter(
        url_patterns
    )
})
