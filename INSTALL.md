# Installation instructions

1. NodeJS
1. MongoDB
1. Run `scripts/clean.sh` which will delete robots and users from
the robot-directory db and then insert data from robots_data.json and
will run the hash_passwords.js script to create a bunch of robot
users.
1. Every robot is capable of logging in with password: `robot`
1. A robot can only edit their own profile.
