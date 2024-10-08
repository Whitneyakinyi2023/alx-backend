#!/usr/bin/env python3

from flask import Flask, render_template, request, g
from flask_babel import Babel, _
from pytz import timezone
import pytz.exceptions

app = Flask(__name__)
babel = Babel(app)

users = {
    1: {"name": "Balou", "locale": "fr", "timezone": "Europe/Paris"},
    2: {"name": "Beyonce", "locale": "en", "timezone": "US/Central"},
    3: {"name": "Spock", "locale": "kg", "timezone": "Vulcan"},
    4: {"name": "Teletubby", "locale": None, "timezone": "Europe/London"},
}

class Config:
    LANGUAGES = ['en', 'fr']
    BABEL_DEFAULT_LOCALE = 'en'
    BABEL_DEFAULT_TIMEZONE = 'UTC'

app.config.from_object(Config)

def get_user():
    user_id = request.args.get('login_as')
    if user_id:
        return users.get(int(user_id))
    return None

@app.before_request
def before_request():
    g.user = get_user()

@babel.localeselector
def get_locale():
    # 1. Locale from URL parameters
    locale = request.args.get('locale')
    if locale in app.config['LANGUAGES']:
        return locale

    # 2. Locale from user settings
    if g.user and g.user.get('locale') in app.config['LANGUAGES']:
        return g.user['locale']

    # 3. Locale from request headers
    locale = request.accept_languages.best_match(app.config['LANGUAGES'])
    if locale:
        return locale

    # 4. Default locale
    return app.config['BABEL_DEFAULT_LOCALE']

@babel.timezoneselector
def get_timezone():
    # 1. Time zone from URL parameters
    tz_param = request.args.get('timezone')
    if tz_param:
        try:
            return timezone(tz_param)
        except pytz.exceptions.UnknownTimeZoneError:
            pass

    # 2. Time zone from user settings
    if g.user and g.user.get('timezone'):
        try:
            return timezone(g.user['timezone'])
        except pytz.exceptions.UnknownTimeZoneError:
            pass

    # 3. Default to UTC
    return timezone(app.config['BABEL_DEFAULT_TIMEZONE'])

@app.route('/')
def index():
    return render_template('7-index.html')

if __name__ == "__main__":
    app.run(debug=True)
