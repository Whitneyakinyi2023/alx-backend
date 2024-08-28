#!/usr/bin/env python3
"""7-app.py"""


from flask import Flask, render_template, request, g
from flask_babel import Babel, _
from pytz import timezone
import pytz.exceptions


users = {
    1: {"name": "Balou", "locale": "fr", "timezone": "Europe/Paris"},
    2: {"name": "Beyonce", "locale": "en", "timezone": "US/Central"},
    3: {"name": "Spock", "locale": "kg", "timezone": "Vulcan"},
    4: {"name": "Teletubby", "locale": None, "timezone": "Europe/London"},
}


class Config:
    """class config"""
    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = 'en'
    BABEL_DEFAULT_TIMEZONE = 'UTC'


app = Flask(__name__)
app.config.from_object(Config)
babel = Babel(app)


def get_user():
    """Get user func"""
    user_id = request.args.get('login_as')
    if user_id:
        return users.get(int(user_id))
    return None


@app.before_request
def before_request():
    """Before request func"""
    g.user = get_user()


@babel.localeselector
def get_locale():
    """Get locale func"""
    if g.user and g.user['locale'] in app.config['LANGUAGES']:
        return g.user['locale']
    locale = request.args.get('locale')
    if locale and locale in app.config['LANGUAGES']:
        return locale
    return request.accept_languages.best_match(app.config['LANGUAGES'])


@babel.timezoneselector
def get_timezone():
    """Get timezine func"""
    try:
        if g.user and g.user['timezone']:
            return timezone(g.user['timezone'])
    except pytz.exceptions.UnknownTimeZoneError:
        pass
    return timezone(app.config['BABEL_DEFAULT_TIMEZONE'])


@app.route('/')
def index():
    """Roting"""
    return render_template('7-index.html')


if __name__ == "__main__":
    app.run(debug=True)
