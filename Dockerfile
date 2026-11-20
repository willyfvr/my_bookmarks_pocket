FROM nginx:alpine

# Limpia los archivos por defecto de Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia los archivos de tu proyecto al servidor
COPY index.html /usr/share/nginx/html/
COPY style.css /usr/share/nginx/html/
COPY background.js /usr/share/nginx/html/
COPY manifest.json /usr/share/nginx/html/
COPY js/ /usr/share/nginx/html/js/

EXPOSE 80