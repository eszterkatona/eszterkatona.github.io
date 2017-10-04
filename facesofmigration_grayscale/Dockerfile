FROM nginx:1.10.2


COPY nginx/* /etc/nginx/conf.d/
ADD src /var/www

CMD ["nginx", "-g", "daemon off;"]
