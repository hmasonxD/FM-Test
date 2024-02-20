from flask import Flask, render_template, request, redirect, url_for
from flask_mysqldb import MySQL
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import InputRequired, Length
from flask_wtf import FlaskForm
from wtforms import ValidationError
import secrets

app = Flask(__name__)
app.config['SECRET_KEY'] = secrets.token_hex(16)  # secret key for flashwtf

# Configure db
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'aAaA1997'
app.config['MYSQL_DB'] = 'myschema'
app.config['MYSQL_CURSORCLASS'] = 'DictCursor'

mysql = MySQL(app)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

# Custom User class
class User(UserMixin):
    def __init__(self, id, username, password):
        self.id = id
        self.username = username
        self.password = password

# User loader function
@login_manager.user_loader
def load_user(user_id):
    cur = mysql.connection.cursor()
    cur.execute("SELECT id, username, password FROM users WHERE id = %s", (user_id,))
    user_data = cur.fetchone()
    cur.close()

    if user_data:
        user = User(user_data['id'], user_data['username'], user_data['password'])
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

@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if request.method == 'POST':
        userDetails = request.form
        username = userDetails['username']
        password = userDetails['password']
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
            return redirect(url_for('home'))
        else:
            return render_template('login.html', form=form)
    else:
        return render_template('login.html', form=form)


@app.route('/register', methods=['GET','POST'])
def register():
    form = RegisterForm()

    if request.method == 'POST' and form.validate_on_submit():
        userDetails = request.form
        firstname = userDetails['firstname']
        lastname = userDetails['lastname']
        username = userDetails['username']
        email = userDetails['email'] 
        password = userDetails['password']

        cur = mysql.connection.cursor()
        cur.execute("INSERT INTO users (Firstname, Lastname, username, email, password) VALUES (%s, %s, %s, %s, %s)",
                    (firstname, lastname, username, email, password))

        mysql.connection.commit()
        cur.close()
        return redirect(url_for('login'))

    return render_template('register.html', form=form)

@app.route('/home')
@login_required
def home():
    return render_template('home.html', username=current_user.username)

@app.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return redirect(url_for('index'))


@app.route('/users', methods=['GET'])
def users():
    cur = mysql.connection.cursor()
    resultValue = cur.execute("SELECT id, Firstname, lastname, username, email, password FROM users")
    
    if resultValue > 0:
        user_details = cur.fetchall()
        print(user_details) 
        return render_template('users.html', user_details=user_details)
    
    return render_template('users.html', user_details=None)

@app.route('/products', methods=['GET'])
def products():
    cur = mysql.connection.cursor()
    resultValue = cur.execute("SELECT id, name, description, price FROM products")

    product_details = cur.fetchall() if resultValue > 0 else None
    return render_template('products.html', product_details=product_details)

if __name__ == '__main__':
    app.run(debug=True)
