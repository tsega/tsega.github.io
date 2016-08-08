---
layout: post
title:  "How to setup a VPS for PHP/MySQL development"
date:   2013-03-21
desc: "A tutorial to setup a VPS from scratch"
keywords: "linux,vps,php,mysql,git"
categories: [Linux]
tags: [VPS]
icon: fa-linux
---

This is a step by step tutorial on how to create a VPS on stackable.com and configure it with a LAMPP stack, an FTP server, Mail server and Firewall.

# Create VPS in stackable dashboard #
1. Log into the [stachable.com dashboard](https://control.stackable.com/panel.html#login)
2. Click on the **Create New Container** button at the top.
3. Fill in the form:

* Name: project name, e.g., MBU4U for madebyus4u
* Type: VPS
* Password: a complicated password for root 
* Size: choose memory size that fits your need

Save password and VPS address in plain text document for future reference.

# VPS Application User Setup #

Log into the VPS using ssh

    $ ssh root@ip-address

supply password after prompt

Change password of root

    $ passwd

Supply new password and confirmation when prompted

Add new user, that would serve as the Application owner

    $ adduser newusername

Create new admin group

    $ groupadd admin

Add new user to admin group

    $ usermod -g admin newusername

Give sudo privillege to admin group

    $ visudo 

once the file loads add the following line

    %admin ALL=(ALL) ALL

Exit ssh and switch to new user
 
    $ ssh newusername@ip-address

Disable root log in over ssh, this is done for security reasons.

    $nano /etc/ssh/sshd_config

Once file loads change the following line

    PermitRootLogin = no

Then restart ssh 

    $ /etc/init.d/ssh restart



# Install LAMPP stack #

## Install Apache2 ##

    $ sudo apt-get update
    $ sudo apt-get install apache2

Make public web directory for admin user

    $ sudo mkdir app/public
    $ sudo chmod 777 -R app/public

Create virtual host on Apache to point to newly created directory

    $ sudo cp /etc/apache2/sites-available/default /etc/apache2/sites-available/domain_name

Edit newly copied file

    $ sudo nano /etc/apache2/sites-available/domain_name

Add the following to the VirtualHost section as follows

    <VirtualHost *:80>

        ServerAdmin admin@domain_name
        ServerName  domain_name
        ServerAlias www.domain_name
        DocumentRoot /home/user_name/app/public

    </VirtualHost>

Enable mode rewrite

    $ sudo a2enmod rewrite

In the virtual host configuration change AllowOverride option just under Option Indexes as follows:

    Options Indexes FollowSymLinks MultiViews
    AllowOverride all

Enable site configuration

    $ sudo a2ensite file_name

Disable default configuration

    $ sudo a2dissite default

Also edit */etc/hostname* and */etc/hosts accordingly*

## Install SSL an Certificate ##

Generate SSL key on VPS

    $ openssl req -new -newkey rsa:2048 -nodes -keyout yourdomain.key -out yourdomain.csr

Then use the ***.csr** file to generate SSL Certificate using godaddy.com tool. Download the certificate zip containing domainname.crt and sf_bundle.crt, upload them to the VPS; move the uploaded files to apache ssl folder,

    $ sudo mkdir /etc/apache2/ssl

    $ sudo cp /path/to/certificate /etc/apache2/ssl/

    $ sudo cp /path/to/bundle /etc/apache2/ssl/

    $ sudo cp /path/to/key /etc/apache2/ssl/

Open the default ssl apache config file

    $ sudo nano /etc/apache2/sites-available/default-ssl

Change the following:

    DocumentRoot /home/username/app/public

    AllowOverride all

    SSLCertificateFile /etc/apache2/ssl/domainname.crt
    SSLCertificateKeyFile /etc/apache2/ssl/domainname.key
    SSLCertificateChainFile /etc/apache2/ssl/sf_bundle.crt

Save and close, enable default-ssl site

    $ sudo a2ensite default-ssl

Restart/reload apache

    $ sudo service apache2 restart/reload

# Install MySql #

    $ sudo apt-get isntall mysql-server libapache2-mod-auth-mysql php5-mysql

Activate MySql

    $sudo mysql_install_db

Finish up with the MySql set up script, and follow along with the instructions

    $ sudo /usr/bin/mysql_secure_installation

Note: Generate long password to be used for the mysql user

    mysql> select password('seed');

Enable remote connection for MySql

    $ sudo nano /etc/mysql/my.cnf

Find section *[mysqld]* and comment out the following lines:

    #skip-networking or
    #skip-external-locking 

Also add the following line

    bind-address      = ip-address

Save and close file.

Restart mysql 

    $ sudo service mysql restart

Create admin user on MySql

    $ mysql -u root password root_password

Once logged in to MySql create the db user with super user privileges

One from localhost

    > CREATE USER 'mysql_user'@'localhost' identified by '41_character_password';
    > GRANT ALL PRIVILEGES ON *.* TO 'mysql_user'@'localhost' WITH GRANT OPTION; 

One from any host

    > CREATE USER 'mysql_user'@'%' identified by '41_character_password';
    > GRANT ALL PRIVILEGES ON *.* TO 'mysql_user'@'%' WITH GRANT OPTION;

Flush privileges to make sure the privileges are reloaded:

    > FLUSH PRIVILEGES;

# Install PHP #

    $ sudo apt-get install php5 libapache2-mod-php5 php5-mcrypt

Add php to the directory index

    $ sudo nano /etc/apache2/mods-enabled/dir.conf

Add *index.php* to the beginning of index files

    <IfModule mod_dir.c>
  
      DirectoryIndex index.php index.html index.cgi index.pl index.php index.xhtml index.htm

    </IfModule>

Install PHP Modules as needed, find them using *apt-cache* search:

    $ sudo apt-cache search php5-

Notable ones to add, **php5-cli, php5-curl, php5-gd, php5-mysql**

Restart apache to allow changes to take effect

    $ sudo service apache2 restart


# Install VSFTP #

    $ sudo apt-get install vsftpd 

Edit vsftpd's configuration

    $ sudo nano /etc/vsftp.conf

Disable anonymous login

    anonymous_enable=NO

    enable local users

    local_enable=YES 

Allow them to write in the directory

    write_enable=YES

Jail local user to his own root directory

    chroot_local_user=YES // uncomment this line

Restart vsftpd

    $ sudo service vsftpd restart

# Install Firewall #

Install Uncomplicated Fire Wall UFW as follows

    $ sudo apt-get install ufw

Add rules to open port as follows

    $ sudo ufw allow 80 // Apache
    $ sudo ufw allow 21 // FTP
    $ sudo ufw allow 22 // SSH
    $ sudo ufw allow 3306 // MySql
    $ sudo ufw allow 443 // HTTPS-default 433 should be correct

Enable the UFW

    $ sudo ufw enable

