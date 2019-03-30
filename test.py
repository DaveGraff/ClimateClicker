from flask import Flask, render_template, url_for

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
@app.route('/home')
def home():
	return render_template('ClimateClicker.html')

if __name__ == '__main__':
    app.run()
