# friendshipradio.rodeo

An internet radio station for my good pal and her good pals. This project is modeled off of introtorhythm.com but with it's own unique UI and set of features. 

## Technologies and Frameworks

- Django
- Icecast
- ezstream
- Ubuntu hostg server
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
python3 managae.py createsuperuser

# Run it
python3 manage.py runserver
```