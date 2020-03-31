FROM centos:7.7.1908
MAINTAINER openmediation
ENV LANG="en_US.UTF-8" \
    LC_ALL="en_US.UTF-8"
ENV SYSTEMNAME "omsystem"
ADD docker-entrypoint.sh /
ADD nginx/ /usr/local/nginx/
RUN cp /usr/share/zoneinfo/Etc/GMT0 /etc/localtime
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost/ || exit 1
EXPOSE 80 443
ENTRYPOINT ["/docker-entrypoint.sh"] 
CMD ["omnginx"]
