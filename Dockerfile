FROM nginx:alpine

# Removing nginx default page.
RUN rm -rf /usr/share/nginx/html/*

# Copying nginx configuration.
COPY /nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Copying  source into web server root.
COPY /dist /usr/share/nginx/html

# Exposing ports.
EXPOSE 80

# Starting server.
CMD ["nginx", "-g", "daemon off;"]