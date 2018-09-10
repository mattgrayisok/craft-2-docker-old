FROM php:7.1-fpm

RUN apt-get update && apt-get install -y \
        libfreetype6-dev \
        libjpeg62-turbo-dev \
        libmcrypt-dev \
        libpng-dev \
        libbz2-dev \
        libssl-dev

RUN docker-php-ext-install -j$(nproc)  mcrypt pdo_mysql

RUN docker-php-ext-configure gd --with-freetype-dir=/usr/include/ --with-jpeg-dir=/usr/include/

RUN docker-php-ext-install \
        bcmath \
        bz2 \
        exif \
        ftp \
        gd \
        gettext \
        mbstring \
        opcache \
        shmop \
        sockets \
        sysvmsg \
        sysvsem \
        sysvshm \
        zip \
        iconv

RUN apt-get install -y wget unzip

RUN echo "upload_max_filesize = 10M" > /usr/local/etc/php/php.ini
RUN echo "post_max_size = 10M" >> /usr/local/etc/php/php.ini

RUN wget -O latest.zip http://download.buildwithcraft.com/craft/2.6/2.6.2999/Craft-2.6.2999.zip?accept_license=yes
RUN unzip latest.zip -d /var/www/html
RUN chown -R www-data:www-data /var/www/html

COPY --chown=www-data:www-data ./src/public /var/www/html/public
COPY --chown=www-data:www-data ./src/config /var/www/html/craft/config
COPY --chown=www-data:www-data ./src/templates /var/www/html/craft/templates
COPY --chown=www-data:www-data ./src/plugins /var/www/html/craft/plugins
