FROM php:8.3-apache

RUN apt-get update \
    && apt-get install -y libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql

COPY apache-config.conf /etc/apache2/sites-available/000-default.conf

RUN a2enmod rewrite

RUN apt-get install -y unzip
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer


RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

