#!/bin/bash
#Git cmd to create repository
user="Winnguyen1511"
api=https://api.github.com/user/repos
reponame="Linear_Regression_Demo"
private="false"
gitdir=git@github.com:$user/$reponame.git
curl -u $user $api -d '{"name":"Linear_Regression_Demo"}'

git init
git add .
git commit -m "Init repos"
git remote add origin $gitdir
git push -u origin master
