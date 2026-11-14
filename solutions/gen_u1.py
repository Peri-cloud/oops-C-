#!/usr/bin/env python3
"""Unit 1: write QB solutions as .cpp files + test cases JSON."""
import json, os

S = '/home/z/my-project/scripts/solutions'
os.makedirs(S, exist_ok=True)

CODE = {}

CODE['U1_D1'] = '''#include <iostream>
#include <iomanip>
using namespace std;
class Box {
    double l, w, h;
public:
    Box() {
        l = 1;
        w = 1;
        h = 1;
    }
    Box(double side) {
        l = side;
        w = side;
        h = side;
    }
    Box(double a, double b, double c) {
        l = a;
        w = b;
        h = c;
    }
    double volume() {
        return l * w * h;
    }
};
int main() {
    double side, a, b, c;
    cin >> side >> a >> b >> c;
    Box first;
    Box second(side);
    Box third(a, b, c);
    cout << fixed << setprecision(2);
    cout << "Default Box Volume: " << first.volume() << endl;
    cout << "Cube Volume: " << second.volume() << endl;
    cout << "Box Volume: " << third.volume() << endl;
    return 0;
}'''

CODE['U1_D2'] = '''#include <iostream>
#include <string>
using namespace std;
class Document {
    string title;
    int pages;
public:
    Document(string t, int p) {
        title = t;
        pages = p;
        cout << "Created: " << title << endl;
    }
    Document(Document &other) {
        title = other.title + "_copy";
        pages = other.pages;
        cout << "Copied: " << title << endl;
    }
    void show() {
        cout << "Title: " << title << ", Pages: " << pages << endl;
    }
    ~Document() {
        cout << "Destroyed: " << title << endl;
    }
};
int main() {
    string title;
    int pages;
    cin >> title >> pages;
    Document d1(title, pages);
    Document d2 = d1;
    d1.show();
    d2.show();
    return 0;
}'''

CODE['U1_D3'] = '''#include <iostream>
#include <iomanip>
#include <string>
using namespace std;
class BankAccount {
    double balance;
public:
    BankAccount(double b) {
        balance = b;
    }
    void deposit(double amount) {
        balance = balance + amount;
    }
    string withdraw(double amount) {
        if (amount <= balance) {
            balance = balance - amount;
            return "Withdrawal Successful";
        }
        return "Insufficient Balance";
    }
    double getBalance() {
        return balance;
    }
};
int main() {
    double initial, dep, wd;
    cin >> initial >> dep >> wd;
    BankAccount acc(initial);
    acc.deposit(dep);
    cout << acc.withdraw(wd) << endl;
    cout << fixed << setprecision(2);
    cout << "Balance: " << acc.getBalance() << endl;
    return 0;
}'''

CODE['U1_D4'] = '''#include <iostream>
#include <string>
using namespace std;
class Student {
    string name;
    int marks;
public:
    Student(string name, int marks) {
        this->name = name;
        this->marks = marks;
    }
    Student& addBonus(int bonus) {
        this->marks = this->marks + bonus;
        return *this;
    }
    void display() {
        cout << "Name: " << this->name << endl;
        cout << "Marks: " << this->marks << endl;
    }
};
int main() {
    string name;
    int marks, b1, b2;
    cin >> name >> marks >> b1 >> b2;
    Student s(name, marks);
    s.addBonus(b1).addBonus(b2);
    s.display();
    return 0;
}'''

CODE['U1_D5'] = '''#include <iostream>
#include <string>
using namespace std;
class Player {
    string name;
    int score;
    static int highest;
    static string topPlayer;
public:
    Player(string n, int s) {
        name = n;
        score = s;
        if (score > highest) {
            highest = score;
            topPlayer = name;
        }
    }
    static int getHighest() {
        return highest;
    }
    static string getTopPlayer() {
        return topPlayer;
    }
};
int Player::highest = 0;
string Player::topPlayer = "None";
int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        string name;
        int score;
        cin >> name >> score;
        Player p(name, score);
    }
    cout << "Top Player: " << Player::getTopPlayer() << endl;
    cout << "Highest Score: " << Player::getHighest() << endl;
    return 0;
}'''

CODE['U1_C1'] = '''#include <iostream>
using namespace std;
bool isPrime(int x) {
    if (x < 2) {
        return false;
    }
    for (int i = 2; i * i <= x; i++) {
        if (x % i == 0) {
            return false;
        }
    }
    return true;
}
int main() {
    int a, b;
    cin >> a >> b;
    int count = 0;
    int largest = 0;
    for (int i = a; i <= b; i++) {
        if (isPrime(i)) {
            count = count + 1;
            largest = i;
        }
    }
    cout << "Prime Count: " << count << endl;
    if (count == 0) {
        cout << "Largest Prime: None" << endl;
    } else {
        cout << "Largest Prime: " << largest << endl;
    }
    return 0;
}'''

CODE['U1_C2'] = '''#include <iostream>
#include <iomanip>
using namespace std;
class TemperatureLog {
    double readings[10];
    int count;
public:
    TemperatureLog() {
        count = 0;
    }
    void addReading(double t) {
        readings[count] = t;
        count = count + 1;
    }
    double getHighest() {
        double best = readings[0];
        for (int i = 1; i < count; i++) {
            if (readings[i] > best) {
                best = readings[i];
            }
        }
        return best;
    }
    double getLowest() {
        double least = readings[0];
        for (int i = 1; i < count; i++) {
            if (readings[i] < least) {
                least = readings[i];
            }
        }
        return least;
    }
    double getAverage() {
        double sum = 0;
        for (int i = 0; i < count; i++) {
            sum = sum + readings[i];
        }
        return sum / count;
    }
};
int main() {
    int n;
    cin >> n;
    TemperatureLog log;
    for (int i = 0; i < n; i++) {
        double t;
        cin >> t;
        log.addReading(t);
    }
    cout << fixed << setprecision(2);
    cout << "Highest: " << log.getHighest() << endl;
    cout << "Lowest: " << log.getLowest() << endl;
    cout << "Average: " << log.getAverage() << endl;
    return 0;
}'''

CODE['U1_C3'] = '''#include <iostream>
#include <string>
using namespace std;
class Timer {
    string label;
    int seconds;
public:
    Timer(string label, int seconds) {
        this->label = label;
        this->seconds = seconds;
        cout << "Timer Created: " << label << endl;
    }
    void start() {
        for (int i = seconds; i >= 1; i--) {
            cout << i << endl;
        }
        cout << "Time Up" << endl;
    }
    ~Timer() {
        cout << "Timer Destroyed: " << label << endl;
    }
};
int main() {
    string label;
    int seconds;
    cin >> label >> seconds;
    Timer t(label, seconds);
    t.start();
    return 0;
}'''

CODE['U1_C4'] = '''#include <iostream>
using namespace std;
int main() {
    int year, month;
    cin >> year >> month;
    bool leap = false;
    if (year % 400 == 0) {
        leap = true;
    } else if (year % 100 == 0) {
        leap = false;
    } else if (year % 4 == 0) {
        leap = true;
    }
    int days;
    if (month == 2) {
        if (leap) {
            days = 29;
        } else {
            days = 28;
        }
    } else if (month == 4 || month == 6 || month == 9 || month == 11) {
        days = 30;
    } else {
        days = 31;
    }
    if (leap) {
        cout << "Leap Year: Yes" << endl;
    } else {
        cout << "Leap Year: No" << endl;
    }
    cout << "Days: " << days << endl;
    return 0;
}'''

TESTS = {
 'U1_D1': [
  ('3.0 2.0 4.0 5.0', 'Default Box Volume: 1.00\nCube Volume: 27.00\nBox Volume: 40.00', 'sample'),
  ('4.0 6.0 2.5 2.0', 'Default Box Volume: 1.00\nCube Volume: 64.00\nBox Volume: 30.00', 'sample'),
  ('2.0 3.0 3.0 3.0', 'Default Box Volume: 1.00\nCube Volume: 8.00\nBox Volume: 27.00', 'answerkey'),
  ('5.0 10.0 2.0 1.5', 'Default Box Volume: 1.00\nCube Volume: 125.00\nBox Volume: 30.00', 'answerkey'),
  ('1.2 2.4 3.5 1.2', 'Default Box Volume: 1.00\nCube Volume: 1.73\nBox Volume: 10.08', 'answerkey'),
  ('7.3 4.2 6.1 3.3', 'Default Box Volume: 1.00\nCube Volume: 389.02\nBox Volume: 84.55', 'answerkey'),
 ],
 'U1_D2': [
  ('Report 10', 'Created: Report\nCopied: Report_copy\nTitle: Report, Pages: 10\nTitle: Report_copy, Pages: 10\nDestroyed: Report_copy\nDestroyed: Report', 'sample'),
  ('Notes 25', 'Created: Notes\nCopied: Notes_copy\nTitle: Notes, Pages: 25\nTitle: Notes_copy, Pages: 25\nDestroyed: Notes_copy\nDestroyed: Notes', 'sample'),
  ('Invoice 4', 'Created: Invoice\nCopied: Invoice_copy\nTitle: Invoice, Pages: 4\nTitle: Invoice_copy, Pages: 4\nDestroyed: Invoice_copy\nDestroyed: Invoice', 'hidden'),
  ('Resume 2', 'Created: Resume\nCopied: Resume_copy\nTitle: Resume, Pages: 2\nTitle: Resume_copy, Pages: 2\nDestroyed: Resume_copy\nDestroyed: Resume', 'hidden'),
  ('Syllabus 120', 'Created: Syllabus\nCopied: Syllabus_copy\nTitle: Syllabus, Pages: 120\nTitle: Syllabus_copy, Pages: 120\nDestroyed: Syllabus_copy\nDestroyed: Syllabus', 'hidden'),
  ('Thesis 350', 'Created: Thesis\nCopied: Thesis_copy\nTitle: Thesis, Pages: 350\nTitle: Thesis_copy, Pages: 350\nDestroyed: Thesis_copy\nDestroyed: Thesis', 'hidden'),
 ],
 'U1_D3': [
  ('5000.0 1000.0 2000.0', 'Withdrawal Successful\nBalance: 4000.00', 'sample'),
  ('1500.5 500.0 3000.0', 'Insufficient Balance\nBalance: 2000.50', 'sample'),
  ('3000.0 500.0 1000.0', 'Withdrawal Successful\nBalance: 2500.00', 'hidden'),
  ('800.0 200.0 5000.0', 'Insufficient Balance\nBalance: 1000.00', 'hidden'),
  ('12345.75 1000.25 345.5', 'Withdrawal Successful\nBalance: 13000.50', 'hidden'),
  ('99.5 0.5 100.0', 'Withdrawal Successful\nBalance: 0.00', 'hidden'),
 ],
 'U1_D4': [
  ('Arun 70 5 3', 'Name: Arun\nMarks: 78', 'sample'),
  ('Meena 55 10 5', 'Name: Meena\nMarks: 70', 'sample'),
  ('Ravi 40 2 3', 'Name: Ravi\nMarks: 45', 'hidden'),
  ('Priya 82 8 4', 'Name: Priya\nMarks: 94', 'hidden'),
  ('Kiran 60 15 10', 'Name: Kiran\nMarks: 85', 'hidden'),
  ('Sneha 33 7 20', 'Name: Sneha\nMarks: 60', 'hidden'),
 ],
 'U1_D5': [
  ('3\nArun 70 Meena 92 Ravi 85', 'Top Player: Meena\nHighest Score: 92', 'sample'),
  ('2\nPriya 60 Kiran 60', 'Top Player: Priya\nHighest Score: 60', 'sample'),
  ('4\nDivya 45 Hari 88 Isha 67 Jay 88', 'Top Player: Hari\nHighest Score: 88', 'hidden'),
  ('1\nSneha 99', 'Top Player: Sneha\nHighest Score: 99', 'hidden'),
  ('5\nLatha 52 Mani 61 Nila 77 Omar 93 Pooja 80', 'Top Player: Omar\nHighest Score: 93', 'hidden'),
  ('6\nQadir 40 Rani 72 Sita 72 Tarun 55 Uma 90 Vijay 90', 'Top Player: Uma\nHighest Score: 90', 'hidden'),
 ],
 'U1_C1': [
  ('10 30', 'Prime Count: 6\nLargest Prime: 29', 'sample'),
  ('1 10', 'Prime Count: 4\nLargest Prime: 7', 'sample'),
  ('20 22', 'Prime Count: 0\nLargest Prime: None', 'hidden'),
  ('50 60', 'Prime Count: 2\nLargest Prime: 59', 'hidden'),
  ('100 150', 'Prime Count: 10\nLargest Prime: 149', 'hidden'),
  ('500 600', 'Prime Count: 14\nLargest Prime: 599', 'hidden'),
 ],
 'U1_C2': [
  ('5\n22.5 24.0 19.5 26.5 23.0', 'Highest: 26.50\nLowest: 19.50\nAverage: 23.10', 'sample'),
  ('3\n30.0 28.5 31.5', 'Highest: 31.50\nLowest: 28.50\nAverage: 30.00', 'sample'),
  ('1\n25.0', 'Highest: 25.00\nLowest: 25.00\nAverage: 25.00', 'hidden'),
  ('4\n18.0 21.0 19.0 22.0', 'Highest: 22.00\nLowest: 18.00\nAverage: 20.00', 'hidden'),
  ('7\n12.5 15.0 9.5 18.0 11.0 14.5 16.0', 'Highest: 18.00\nLowest: 9.50\nAverage: 13.79', 'hidden'),
  ('10\n-5.0 -2.5 0.0 3.5 7.0 -8.0 1.5 4.0 2.0 -1.0', 'Highest: 7.00\nLowest: -8.00\nAverage: 0.15', 'hidden'),
 ],
 'U1_C3': [
  ('Tea 3', 'Timer Created: Tea\n3\n2\n1\nTime Up\nTimer Destroyed: Tea', 'sample'),
  ('Pasta 5', 'Timer Created: Pasta\n5\n4\n3\n2\n1\nTime Up\nTimer Destroyed: Pasta', 'sample'),
  ('Egg 1', 'Timer Created: Egg\n1\nTime Up\nTimer Destroyed: Egg', 'hidden'),
  ('Coffee 4', 'Timer Created: Coffee\n4\n3\n2\n1\nTime Up\nTimer Destroyed: Coffee', 'hidden'),
  ('Noodles 8', 'Timer Created: Noodles\n8\n7\n6\n5\n4\n3\n2\n1\nTime Up\nTimer Destroyed: Noodles', 'hidden'),
  ('Bread 10', 'Timer Created: Bread\n10\n9\n8\n7\n6\n5\n4\n3\n2\n1\nTime Up\nTimer Destroyed: Bread', 'hidden'),
 ],
 'U1_C4': [
  ('2024 2', 'Leap Year: Yes\nDays: 29', 'sample'),
  ('2023 2', 'Leap Year: No\nDays: 28', 'sample'),
  ('2023 7', 'Leap Year: No\nDays: 31', 'hidden'),
  ('2022 11', 'Leap Year: No\nDays: 30', 'hidden'),
  ('1900 2', 'Leap Year: No\nDays: 28', 'hidden'),
  ('2000 2', 'Leap Year: Yes\nDays: 29', 'hidden'),
 ],
}

for k, code in CODE.items():
    with open(f'{S}/{k}.cpp', 'w') as f:
        f.write(code + '\n')
with open(f'{S}/tests_u1.json', 'w') as f:
    json.dump(TESTS, f, indent=1)
print('Unit 1 files written:', len(CODE))
