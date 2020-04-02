FROM adtiming/ombuilder as builder
ARG DSUI_URL="https://github.com/AdTiming/OM-Dashboard-UI.git"
ARG DSUI_DIR="OM-Dashboard-UI"
RUN git clone ${DSUI_URL} && \
    cd ${DSUI_DIR} && \
    yarn install && \
    yarn run build

FROM centos:7.7.1908
MAINTAINER openmediation
ARG DSUI_DIR="OM-Dashboard-UI"
ENV LANG="en_US.UTF-8" \
    LC_ALL="en_US.UTF-8"
ENV SYSTEMNAME "omsystem"
ADD docker-entrypoint.sh /
ADD nginx/ /usr/local/nginx/
COPY --from=builder /data/${DSUI_DIR}/dist/ /usr/local/nginx/html/om-ds-ui/
RUN cp /usr/share/zoneinfo/Etc/GMT0 /etc/localtime && \
    chmod +x /docker-entrypoint.sh /usr/local/nginx/sbin/nginx
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost/ || exit 1
EXPOSE 80 443
ENTRYPOINT ["/docker-entrypoint.sh"] 
CMD ["omnginx"]
