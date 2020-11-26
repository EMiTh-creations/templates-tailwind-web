# # -------------------------
# # https://www.docker.com/blog/how-to-use-the-official-nginx-docker-image/
# # 
# # The article above will show how to build the design folder in docker.
# # -------------------------

FROM nginx:alpine

COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY ./live /usr/share/nginx/html