from flask import Flask, render_template, request, redirect, url_for, jsonify, flash, session
from flask_mysqldb import MySQL
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from flask_cors import CORS , cross_origin
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import InputRequired, Length
from flask_wtf import FlaskForm
# from flask_wtf.csrf import CSRFProtect
from wtforms import ValidationError
from flask_bcrypt import Bcrypt , check_password_hash 
import secrets

app = Flask(__name__)
# CORS(app)
CORS(app, supports_credentials=True)
app.config['SECRET_KEY'] = secrets.token_hex(16)
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'aAaA1997'
app.config['MYSQL_DB'] = 'myschema'
app.config['MYSQL_CURSORCLASS'] = 'DictCursor'
bcrypt = Bcrypt(app)

mysql = MySQL(app)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'


class User(UserMixin):
    def __init__(self, id, username, firstname, lastname, email, password):
        self.id = id
        self.username = username
        self.firstname = firstname
        self.lastname = lastname
        self.email = email
        self.password = password



# @login_manager.user_loader
# def load_user(user_id):
#     cur = mysql.connection.cursor()
#     cur.execute("SELECT id, username, password FROM users WHERE id = %s", (user_id,))
#     user_data = cur.fetchone()
#     cur.close()

#     if user_data:
#         user = User(user_data['id'], user_data['username'], user_data['password'])
#         return user
#     return User.query.get(int(user_id))
@login_manager.user_loader
def load_user(user_id):
    if user_id is not None:
        cur = mysql.connection.cursor()
        cur.execute("SELECT id, username, firstname, lastname, email FROM users WHERE id = %s", (user_id,))
        user_data = cur.fetchone()
        cur.close()

        if user_data:
            user = User(user_data['id'], user_data['username'], user_data['firstname'], user_data['lastname'], user_data['email'], '')
            return user

    return None

class RegisterForm(FlaskForm):
    firstname = StringField(validators=[
                           InputRequired(), Length(min=2, max=20)], render_kw={"placeholder": "First Name"})
    lastname = StringField(validators=[
                           InputRequired(), Length(min=2, max=20)], render_kw={"placeholder": "Last Name"})
    username = StringField(validators=[
                           InputRequired(), Length(min=4, max=20)], render_kw={"placeholder": "Username"})
    password = PasswordField(validators=[
                            InputRequired(), Length(min=8, max=20)], render_kw={"placeholder": "Password"})
    email = StringField(validators=[
                            InputRequired(), Length(min=8, max=40)], render_kw={"placeholder": "email@email.com"})
    submit = SubmitField('Register')
    def validate_username(self, username):
        cur = mysql.connection.cursor()
        cur.execute("SELECT * FROM users WHERE username = %s", (username.data,))
        existing_user_username = cur.fetchone()
        cur.close()

        if existing_user_username:
            raise ValidationError(
                'That username already exists. Please choose a different one.')
class LoginForm(FlaskForm):
    username = StringField(validators=[
                           InputRequired(), Length(min=4, max=20)], render_kw={"placeholder": "Username"})

    password = PasswordField(validators=[
                             InputRequired(), Length(min=8, max=20)], render_kw={"placeholder": "Password"})

    submit = SubmitField('Login')

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        userDetails = request.form
        name = userDetails['firstname']
        email = userDetails['email']
        cur = mysql.connection.cursor()
        cur.execute("INSERT INTO users(name, email) VALUES(%s, %s)", (name, email))
        mysql.connection.commit()
        cur.close()
        return redirect('/users')
    return render_template('index.html')


def perform_login(username, password):
    cur = mysql.connection.cursor()
    cur.execute("SELECT id, username, password FROM users WHERE username = %s AND password = %s", (username, password))
    user_data = cur.fetchone()
    cur.close()

    if user_data:
        user = UserMixin()
        user.id = user_data['id']
        user.username = user_data['username']
        user.password = user_data['password']
        login_user(user)
        flash('Login successful', 'success')  # Flash success message
        return True, None  # Indicates success, no error message
    else:
        return False, 'Invalid credentials'
@app.route('/login', methods=['GET', 'POST' , 'OPTIONS'])
# json approach works with frontend
def login():
    if request.method == 'OPTIONS':
        return '', 200

    form = LoginForm()
    userDetails = None

    if request.method == 'POST':
        userDetails = request.json  # Assuming the request contains JSON data
        username = userDetails.get('username')
        password = userDetails.get('password')

        cur = mysql.connection.cursor()
        cur.execute("SELECT id, username, password FROM users WHERE username = %s AND password = %s", (username, password))
        user_data = cur.fetchone()
        cur.close()

        if user_data:
            user = UserMixin()
            user.id = user_data['id']
            user.username = user_data['username']
            user.password = user_data['password']
            login_user(user)
            flash('Login successful', 'success')  # Flash success message
            return jsonify({'success': True}), 200
        else:
            flash('Invalid credentials. Please try again.', 'error')  # Flash error message
            return jsonify({'success': False, 'error': 'Invalid credentials'}), 401

    return jsonify({'success': False, 'error': 'Invalid request'}), 400

# Render template approach for Flask login
# @app.route('/login', methods=['GET', 'POST'])
# def login():
#     form = LoginForm()
#     userDetails = None
#     if request.method == 'POST':
#         userDetails = request.form
#         username = userDetails['username']
#         password = userDetails['password']
#         cur = mysql.connection.cursor()
#         cur.execute("SELECT id, username, password FROM users WHERE username = %s AND password = %s", (username, password))
#         user_data = cur.fetchone()
#         cur.close()

#         if user_data:
#             user = UserMixin()
#             user.id = user_data['id']
#             user.username = user_data['username']
#             user.password = user_data['password']
#             login_user(user)
#             flash('Login successful', 'success')  # Flash success message
#             return redirect(url_for('home'))
#         else:
#             flash('Invalid credentials. Please try again.', 'error')  # Flash error message
#             return render_template('login.html', form=form)

#     return render_template('login.html', form=form)

@app.route('/register', methods=['GET', 'POST', 'OPTIONS'])
def register():
    if request.method == 'OPTIONS':
        return '', 200

    userDetails = request.json
    firstname = userDetails.get('firstname')
    lastname = userDetails.get('lastname')
    username = userDetails.get('username')
    email = userDetails.get('email')
    password = userDetails.get('password')

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    cur = mysql.connection.cursor()

    try:
        cur.execute("INSERT INTO users (Firstname, Lastname, username, email, password) VALUES (%s, %s, %s, %s, %s)",
                    (firstname, lastname, username, email, hashed_password))
        mysql.connection.commit()
        cur.close()

        # Mimic login logic to set up a user session after registration
        user = UserMixin()
        user.id = cur.lastrowid  # The ID of the newly registered user
        user.username = username
        user.password = hashed_password  # For simplicity, set hashed password

        login_user(user)
        flash('Registration successful', 'success')  # Flash success message
        print("Registration successful")  # Log successful registration

        return jsonify({'success': True, 'message': 'Registration successful'}), 201

    except Exception as e:
        print(f"Error during registration: {str(e)}")
        return jsonify({'success': False, 'error': 'An unexpected error occurred'}), 500
# def register():
#     form = RegisterForm()

#     if form.validate_on_submit():
#         userDetails = request.form
#         firstname = userDetails['firstname']
#         lastname = userDetails['lastname']
#         username = userDetails['username']
#         email = userDetails['email']
#         password = userDetails['password']

#         hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

#         cur = mysql.connection.cursor()
#         cur.execute("INSERT INTO users (Firstname, Lastname, username, email, password) VALUES (%s, %s, %s, %s, %s)",
#                     (firstname, lastname, username, email, hashed_password))
#         mysql.connection.commit()
#         cur.close()

#         if request.headers.get('Content-Type') == 'application/json':
#             return jsonify({'message': 'Registration successful'}), 201
#         else:
#             flash('Registration successful. Please log in.', 'success')
#             return redirect(url_for('login'))

#     # If validation fails, display flash message
#     for field, errors in form.errors.items():
#         for error in errors:
#             flash(f'Error in {field.capitalize()}: {error}', 'error')

#     return render_template('register.html', form=form)

@app.route('/home')
@login_required
def home():
    return render_template('home.html', username=current_user.username)

@app.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return redirect(url_for('index'))


@app.route('/users', methods=['GET'], endpoint='users')
def users():
    cur = mysql.connection.cursor()
    resultValue = cur.execute("SELECT id, firstname, lastname, username, email, password FROM users")
    
    user_details = cur.fetchall() if resultValue > 0 else None

    # Return both HTML and JSON responses
    if request.headers.get('Accept') == 'application/json':
        return jsonify(user_details)
    else:
        return render_template('users.html', user_details=user_details)
@app.route('/profile', methods=['GET'], endpoint='profile')
@login_required
def profile():
    try:
        return render_template('profile.html', user=current_user)

    except Exception as e:
        return jsonify({'error': 'Error fetching profile data', 'details': str(e)}), 500
@app.route('/products', methods=['GET'], endpoint='products')
def products():
    cur = mysql.connection.cursor()
    resultValue = cur.execute("SELECT id, name, description, price FROM products")

    product_details = cur.fetchall() if resultValue > 0 else None

    # Return both HTML and JSON responses
    if request.headers.get('Accept') == 'application/json':
        return jsonify(product_details)
    else:
        return render_template('products.html', product_details=product_details)

@app.route('/change-password', methods=['POST'])
@login_required
def change_password():
    try:
        data = request.get_json()
        current_password = data.get('currentPassword')
        new_password = data.get('newPassword')

        # Validate the current password
        cur = mysql.connection.cursor()
        cur.execute("SELECT id, password FROM users WHERE id = %s", (current_user.id,))
        user_data = cur.fetchone()
        cur.close()

        if not user_data or user_data['password'] != current_password:
            return jsonify({'error': 'Invalid current password'}), 401

        # Update the password in the database
        cur = mysql.connection.cursor()
        cur.execute("UPDATE users SET password = %s WHERE id = %s", (new_password, current_user.id))
        mysql.connection.commit()
        cur.close()

        return jsonify({'message': 'Password changed successfully'}), 200
    except Exception as e:
        return jsonify({'error': 'Error changing password', 'details': str(e)}), 500

@app.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    try:
        cur = mysql.connection.cursor()
        cur.execute("DELETE FROM users WHERE id = %s", (user_id,))
        mysql.connection.commit()
        cur.close()
        return jsonify({'message': 'User deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': 'Error deleting user', 'details': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
