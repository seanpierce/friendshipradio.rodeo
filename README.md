# friendshipradio.rodeo

An internet radio station for my good pal and her good pals. This project is modeled off of introtorhythm.com but with it's own unique UI and set of features. 

## Technologies and Frameworks

- Django, v6.0.8
- Node, v24.16.0
- Icecast
- ezstream
- Ubuntu host server, v24 LTS
- Nginx web server
- Digital Ocean (cloud provider)

## Development

```bash
# Clone the repo
git clone https://github.com/seanpierce/friendshipradio.rodeo.git
cd friendshipradio.rodeo

# Setup virtual environment and install dependencies
python3 -m venv .venv
source .venv/bin/activate # or on Windows: .venv/Scripts/activate
python3 managae.py install -r reqiurements.txt

# Migrate db and create superuser
python3 manage.py migrate
python3 manage.py createsuperuser

# Run it
python3 manage.py runserver
```

### Socket.io Chat App

This project contains a chat app using socket.io. To build/ serve the app locally, enter the following commands.

```bash
cd [project root]/assets/chat

# Install the dependencies
npm i

# Run the server on port 3000
node ./server.js

# `pm2` will be used to serve the chat app in production.
```

## Authors

Original site design by Vern Avola.

Server, backend, chat app, streaming and scheduling software by Sean Pierce ([greenroom.technology](https://greenroom.technology))