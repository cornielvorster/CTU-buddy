from flask import Flask, render_template, request, redirect, url_for, flash, session
from flask_mysqldb import MySQL
from flask_mail import Mail, Message

currentUser = ''
app = Flask(__name__)

app.secret_key = 'koos_en_jan' 

# Configure MySQL
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'Scsict17'
app.config['MYSQL_DB'] = 'CTU_buddy'

#configure flask Mail
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'autoresponse.ctubuddy@gmail.com'  # Your Gmail username
app.config['MAIL_PASSWORD'] = 'CTUbuddy23'  # Your Gmail password
app.config['MAIL_DEFAULT_SENDER'] = 'autoresponse.ctubuddy@gmail.com'

mail = Mail(app)

mysql = MySQL(app)

# Navigation
@app.route('/')
def home():
    if 'username' in session:
        content = session['username']
    else:
        content = "Sign In | Sign Up"

    return render_template('home.html', content=content)


@app.route('/about')
def about():
    return render_template('about-us.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/discussion')
def discussion():
     # Connect to the database
    cursor = mysql.connection.cursor()

    # Execute a query to retrieve posts from the database
    cursor.execute("SELECT * FROM questions")

    # Fetch all the posts
    questions = cursor.fetchall()
    

    # Close the cursor
    cursor.close()

    ########################3
    cursor = mysql.connection.cursor()

    # Execute a query to retrieve posts from the database
    cursor.execute("SELECT * FROM comments")

    # Fetch all the posts
    comments = cursor.fetchall()
    

    # Close the cursor
    cursor.close()
    


    # Render the HTML template with the retrieved data
    return render_template('discussion.html', questions=questions, comments=comments)
    

@app.route('/resources')
def resources():
    return render_template('resources.html')

@app.route('/timetable')
def timetable():
    return render_template('TimeTable.html')

@app.route('/signin')
def signin():
    return render_template('sign.html')

@app.route('/ask-question')
def askQuestion():
    if 'username' in session:
        return render_template('add-question.html')
    else:
        return render_template('sign.html')
    


# Sign In
@app.route('/sign-in', methods=['POST'])
def sign_in():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        # Create a cursor and execute a query to check the user's credentials
        cur = mysql.connection.cursor()
        cur.execute("SELECT * FROM users WHERE username = %s", (username,))
        user = cur.fetchone()
        cur.close()

        if user and user[2] == password:  # Assuming password is stored in the third column
            flash('Login successful', 'success')
            session['username'] = username
            return redirect(url_for('discussion'))
        else:
            flash('Login failed. Please check your username and password.', 'danger')

    return redirect(url_for('signin'))

# signup
@app.route('/sign-up', methods=['POST'])
def sign_up():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        password_repeat = request.form['password_repeat']

        # Check if the password and password_repeat match
        if password != password_repeat:
            flash('Passwords do not match. Please try again.', 'danger')
            return redirect(url_for('home'))

        # Check if the username already exists in the database
        cur = mysql.connection.cursor()
        cur.execute("SELECT * FROM users WHERE username = %s", (username,))
        existing_user = cur.fetchone()

        if existing_user:
            flash('Username already exists. Please choose a different username.', 'danger')
        else:
            # If username is not taken, insert the user into the database
            cur.execute("INSERT INTO users (username, password) VALUES (%s, %s)", (username, password))
            mysql.connection.commit()
            flash('Registration successful. You can now log in.', 'success')

        cur.close()

    return redirect(url_for('signin'))

# Logout
@app.route('/logout')
def logout():
    # Remove the username from the session to log the user out
    
    session.pop('username', None)
    flash('Logged out successfully', 'success')  # Optional: Flash a logout message
    return redirect(url_for('home'))

# ask question
@app.route('/add-question', methods=['POST'])
def addQuestion():
    if request.method == 'POST':
        questionTitle = request.form['questionTitle']
        question_text = request.form['question']
        likes = 0
        owner = session["username"]

        cur = mysql.connection.cursor()
        cur.execute("INSERT INTO questions (question_title, question_text, likes, owner) VALUES (%s, %s, %s, %s)", (questionTitle, question_text, likes, owner))
        mysql.connection.commit()
        cur.close()

    return redirect(url_for('discussion'))

#like
@app.route('/like', methods=['POST'])
def like_question():
    if request.method == 'POST':
        # Get the question ID from the form
        question_id = request.form['question.0']

        # Update the number of likes in the database
        cursor = mysql.connection.cursor()
        cursor.execute("UPDATE questions SET likes = likes + 1 WHERE id = %s", (question_id,))
        mysql.connection.commit()
        cursor.close()

        # Redirect back to the discussion page
        return redirect(url_for('discussion'))


@app.route('/comment', methods=['POST'])
def comment():
    if 'username' not in session:
        return redirect(url_for('signin'))  # Redirect to login page if the user is not logged in

    if request.method == 'POST':
        try:
            # Get the question ID and comment from the form
            question_id = request.form['question.0']
            comment = request.form['comment']
            comment_owner = session['username']

            # Insert the comment into the database
            cursor = mysql.connection.cursor()
            cursor.execute("INSERT INTO comments (comment_, comment_owner, question_id) VALUES (%s, %s, %s)", (comment, comment_owner, question_id))
            mysql.connection.commit()
            cursor.close()

            # Redirect back to the discussion page
            return redirect(url_for('discussion'))
        except Exception as e:
            # Print the error message or log it for debugging
            print("Database error:", str(e))

    # Handle any errors or redirect appropriately if needed
    return render_template('error.html', error="An error occurred while submitting the comment.")

@app.route('/subscribe', methods=['GET', 'POST'])
def subscribe():
    if request.method == 'POST':
        email = request.form['email']
        
        # Send confirmation email
        subject = 'Subscription Confirmation'
        message = f'Thank you for subscribing to our mailing list. Your email ({email}) has been added.'
        msg = Message(subject=subject, recipients=[email], body=message)
        
        mail.send(msg)       

        return 'Subscription successful. Check your email for confirmation.'
    
    return render_template('contact.html')






if __name__ == '__main__':
   app.run()