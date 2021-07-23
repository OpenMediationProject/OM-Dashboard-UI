FROM adtiming/ombuilder as builder
ARG DSUI_URL="https://github.com/AdTiming/OM-Dashboard-UI.git"
ARG DSUI_DIR="OM-Dashboard-UI"
RUN git clone ${DSUI_URL} && \
    cd ${DSUI_DIR} && \
    yarn install && \
    yarn run build

FROM adtiming/ombuilder as nginxbuilder
ARG TENGINE_VERSION='tengine-2.3.3'
ARG TENGINE_URL="http://tengine.taobao.org/download/tengine-2.3.3.tar.gz"
RUN curl -O ${TENGINE_URL} && \
    tar zxf ${TENGINE_VERSION}.tar.gz && \
    cd ${TENGINE_VERSION} && \
    yum install -y gcc pcre-devel openssl-devel automake autoconf libtool make && \
    ./configure --with-http_stub_status_module --with-http_ssl_module --with-http_v2_module --with-stream_ssl_module --with-stream --with-http_realip_module --with-stream_realip_module && \
    make && \
    make install && \
    mkdir /usr/local/nginx/{conf.d,https} && \
    mkdir /usr/local/nginx/html/om-ds-ui && \
    rm -f 50x.html index.html && \
    sed -i -e "/.*#/d"  -e "/^$/d" /usr/local/nginx/conf/nginx.conf && \
    sed -i "/include/i\    include /usr/local/nginx/conf.d/*.conf;" /usr/local/nginx/conf/nginx.conf && \
    sed -i "s/worker_connections.*/worker_connections 102400;/g" /usr/local/nginx/conf/nginx.conf && \
    sed -i "s/worker_processes.*/worker_processes  2;/g" /usr/local/nginx/conf/nginx.conf

FROM centos:7.7.1908
MAINTAINER openmediation
ARG DSUI_DIR="OM-Dashboard-UI"
ENV LANG="en_US.UTF-8" \
    LC_ALL="en_US.UTF-8"
ENV SYSTEMNAME "omsystem"
ADD docker-entrypoint.sh /
COPY --from=nginxbuilder /usr/local/nginx /usr/local/nginx
COPY --from=builder /data/${DSUI_DIR}/dist/ /usr/local/nginx/html/om-ds-ui/
RUN cp /usr/share/zoneinfo/Etc/GMT0 /etc/localtime && \
    chmod +x /docker-entrypoint.sh /usr/local/nginx/sbin/nginx
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost/ || exit 1
EXPOSE 80
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["omnginx"]
