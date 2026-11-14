#!/usr/bin/env python3
"""Unit 2: write QB solutions as .cpp files + test cases JSON."""
import json, os

S = '/home/z/my-project/scripts/solutions'

CODE = {}

CODE['U2_D1'] = '''#include <iostream>
using namespace std;
class Complex {
    int real;
    int imag;
public:
    Complex(int r, int i) {
        real = r;
        imag = i;
    }
    Complex operator+(Complex other) {
        return Complex(real + other.real, imag + other.imag);
    }
    Complex operator*(Complex other) {
        return Complex(real * other.real - imag * other.imag, real * other.imag + imag * other.real);
    }
    void display() {
        cout << "(" << real << ", " << imag << ")" << endl;
    }
};
int main() {
    int a, b, c, d;
    cin >> a >> b >> c >> d;
    Complex first(a, b);
    Complex second(c, d);
    Complex sum = first + second;
    Complex product = first * second;
    cout << "Sum: ";
    sum.display();
    cout << "Product: ";
    product.display();
    return 0;
}'''

CODE['U2_D2'] = '''#include <iostream>
#include <string>
using namespace std;
class Device {
protected:
    string brand;
public:
    Device(string b) {
        brand = b;
        cout << "Device Created: " << brand << endl;
    }
    ~Device() {
        cout << "Device Destroyed: " << brand << endl;
    }
};
class Phone : public Device {
protected:
    int storage;
public:
    Phone(string b, int s) : Device(b) {
        storage = s;
        cout << "Phone Created: " << storage << endl;
    }
    ~Phone() {
        cout << "Phone Destroyed: " << storage << endl;
    }
};
class SmartPhone : public Phone {
    string os;
public:
    SmartPhone(string b, int s, string o) : Phone(b, s) {
        os = o;
        cout << "SmartPhone Created: " << os << endl;
    }
    void show() {
        cout << "Brand: " << brand << ", Storage: " << storage << ", OS: " << os << endl;
    }
    ~SmartPhone() {
        cout << "SmartPhone Destroyed: " << os << endl;
    }
};
int main() {
    string brand, os;
    int storage;
    cin >> brand >> storage >> os;
    SmartPhone s(brand, storage, os);
    s.show();
    return 0;
}'''

CODE['U2_D3'] = '''#include <iostream>
#include <iomanip>
using namespace std;
int larger(int a, int b) {
    if (a > b) {
        return a;
    }
    return b;
}
double larger(double a, double b) {
    if (a > b) {
        return a;
    }
    return b;
}
int larger(int a, int b, int c) {
    int m = a;
    if (b > m) {
        m = b;
    }
    if (c > m) {
        m = c;
    }
    return m;
}
int main() {
    int a, b, c;
    double x, y;
    cin >> a >> b >> c;
    cin >> x >> y;
    cout << fixed << setprecision(2);
    cout << "Larger of two integers: " << larger(a, b) << endl;
    cout << "Larger of two doubles: " << larger(x, y) << endl;
    cout << "Largest of three integers: " << larger(a, b, c) << endl;
    return 0;
}'''

CODE['U2_D4'] = '''#include <iostream>
#include <string>
using namespace std;
class Cinema {
    int available;
public:
    Cinema(int a) {
        available = a;
    }
    void book(int seats) {
        if (seats > available) {
            throw string("Not enough seats");
        }
        available = available - seats;
    }
    int getAvailable() {
        return available;
    }
};
int main() {
    int total, r1, r2;
    cin >> total >> r1 >> r2;
    Cinema c(total);
    int requests[2] = {r1, r2};
    for (int k = 0; k < 2; k++) {
        try {
            c.book(requests[k]);
            cout << "Booked " << requests[k] << " seats" << endl;
        } catch (string msg) {
            cout << "Error: " << msg << endl;
        }
    }
    cout << "Seats Left: " << c.getAvailable() << endl;
    return 0;
}'''

CODE['U2_D5'] = '''#include <iostream>
#include <iomanip>
#include <string>
using namespace std;
class Employee {
protected:
    string name;
    double base;
public:
    Employee(string n, double b) {
        name = n;
        base = b;
    }
    string getName() {
        return name;
    }
    virtual double salary() {
        return base;
    }
};
class Manager : public Employee {
    double bonus;
public:
    Manager(string n, double b, double bo) : Employee(n, b) {
        bonus = bo;
    }
    double salary() {
        return base + bonus;
    }
};
class Intern : public Employee {
public:
    Intern(string n, double b) : Employee(n, b) {
    }
    double salary() {
        return base / 2;
    }
};
int main() {
    string n1, n2;
    double b1, bonus, b2;
    cin >> n1 >> b1 >> bonus;
    cin >> n2 >> b2;
    Manager m(n1, b1, bonus);
    Intern i(n2, b2);
    Employee* list[2];
    list[0] = &m;
    list[1] = &i;
    cout << fixed << setprecision(2);
    for (int k = 0; k < 2; k++) {
        cout << list[k]->getName() << ": " << list[k]->salary() << endl;
    }
    return 0;
}'''

CODE['U2_C1'] = '''#include <iostream>
#include <iomanip>
using namespace std;
class Teacher {
protected:
    double salary;
public:
    void setSalary(double s) {
        salary = s;
    }
};
class Researcher {
protected:
    int papers;
public:
    void setPapers(int p) {
        papers = p;
    }
};
class Professor : public Teacher, public Researcher {
public:
    double totalPay(double bonusPerPaper) {
        return salary + papers * bonusPerPaper;
    }
    void show(double bonusPerPaper) {
        cout << "Salary: " << salary << endl;
        cout << "Papers: " << papers << endl;
        cout << "Total Pay: " << totalPay(bonusPerPaper) << endl;
    }
};
int main() {
    double salary, bonus;
    int papers;
    cin >> salary >> papers >> bonus;
    cout << fixed << setprecision(2);
    Professor p;
    p.setSalary(salary);
    p.setPapers(papers);
    p.show(bonus);
    return 0;
}'''

CODE['U2_C2'] = '''#include <iostream>
using namespace std;
int divide(int a, int b) {
    if (b == 0) {
        throw 0;
    }
    return a / b;
}
int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        int a, b;
        cin >> a >> b;
        try {
            int q = divide(a, b);
            cout << a << " / " << b << " = " << q << endl;
        } catch (int code) {
            cout << a << " / " << b << " : Error: Division by zero" << endl;
        }
    }
    return 0;
}'''

CODE['U2_C3'] = '''#include <iostream>
#include <string>
using namespace std;
class Score {
    int value;
    int highest;
public:
    Score(int start) {
        value = start;
        highest = start;
    }
    Score& operator++() {
        value = value + 1;
        if (value > highest) {
            highest = value;
        }
        return *this;
    }
    Score& operator--() {
        if (value > 0) {
            value = value - 1;
        }
        return *this;
    }
    int getValue() {
        return value;
    }
    int getHighest() {
        return highest;
    }
};
int main() {
    int start;
    string commands;
    cin >> start >> commands;
    Score s(start);
    for (int i = 0; i < commands.length(); i++) {
        if (commands[i] == '+') {
            ++s;
        } else {
            --s;
        }
    }
    cout << "Final Score: " << s.getValue() << endl;
    cout << "Highest Score: " << s.getHighest() << endl;
    return 0;
}'''

CODE['U2_C4'] = '''#include <iostream>
#include <iomanip>
using namespace std;
class Payment {
public:
    virtual double fee(double amount) = 0;
    virtual void name() = 0;
    virtual ~Payment() {
        cout << "Payment Closed" << endl;
    }
};
class CardPayment : public Payment {
public:
    double fee(double amount) {
        return amount * 2.0 / 100;
    }
    void name() {
        cout << "Method: Card" << endl;
    }
    ~CardPayment() {
        cout << "Card Closed" << endl;
    }
};
class UpiPayment : public Payment {
public:
    double fee(double amount) {
        return amount * 0.5 / 100;
    }
    void name() {
        cout << "Method: UPI" << endl;
    }
    ~UpiPayment() {
        cout << "UPI Closed" << endl;
    }
};
int main() {
    int choice;
    double amount;
    cin >> choice >> amount;
    Payment* p;
    if (choice == 1) {
        p = new CardPayment();
    } else {
        p = new UpiPayment();
    }
    cout << fixed << setprecision(2);
    p->name();
    cout << "Fee: " << p->fee(amount) << endl;
    cout << "Total: " << amount + p->fee(amount) << endl;
    delete p;
    return 0;
}'''

TESTS = {
 'U2_D1': [
  ('3 2 1 4', 'Sum: (4, 6)\nProduct: (-5, 14)', 'sample'),
  ('2 -3 4 5', 'Sum: (6, 2)\nProduct: (23, -2)', 'sample'),
  ('1 1 1 1', 'Sum: (2, 2)\nProduct: (0, 2)', 'hidden'),
  ('5 0 0 5', 'Sum: (5, 5)\nProduct: (0, 25)', 'hidden'),
  ('-4 7 3 -2', 'Sum: (-1, 5)\nProduct: (2, 29)', 'hidden'),
  ('10 -6 -8 9', 'Sum: (2, 3)\nProduct: (-26, 138)', 'hidden'),
 ],
 'U2_D2': [
  ('Oppo 32 ColorOS', 'Device Created: Oppo\nPhone Created: 32\nSmartPhone Created: ColorOS\nBrand: Oppo, Storage: 32, OS: ColorOS\nSmartPhone Destroyed: ColorOS\nPhone Destroyed: 32\nDevice Destroyed: Oppo', 'sample'),
  ('Vivo 16 FunTouch', 'Device Created: Vivo\nPhone Created: 16\nSmartPhone Created: FunTouch\nBrand: Vivo, Storage: 16, OS: FunTouch\nSmartPhone Destroyed: FunTouch\nPhone Destroyed: 16\nDevice Destroyed: Vivo', 'sample'),
  ('Nokia 64 Android', 'Device Created: Nokia\nPhone Created: 64\nSmartPhone Created: Android\nBrand: Nokia, Storage: 64, OS: Android\nSmartPhone Destroyed: Android\nPhone Destroyed: 64\nDevice Destroyed: Nokia', 'hidden'),
  ('Sony 128 Windows', 'Device Created: Sony\nPhone Created: 128\nSmartPhone Created: Windows\nBrand: Sony, Storage: 128, OS: Windows\nSmartPhone Destroyed: Windows\nPhone Destroyed: 128\nDevice Destroyed: Sony', 'hidden'),
  ('Samsung 256 Tizen', 'Device Created: Samsung\nPhone Created: 256\nSmartPhone Created: Tizen\nBrand: Samsung, Storage: 256, OS: Tizen\nSmartPhone Destroyed: Tizen\nPhone Destroyed: 256\nDevice Destroyed: Samsung', 'hidden'),
  ('Apple 512 iOS', 'Device Created: Apple\nPhone Created: 512\nSmartPhone Created: iOS\nBrand: Apple, Storage: 512, OS: iOS\nSmartPhone Destroyed: iOS\nPhone Destroyed: 512\nDevice Destroyed: Apple', 'hidden'),
 ],
 'U2_D3': [
  ('12 35 20\n4.5 9.25', 'Larger of two integers: 35\nLarger of two doubles: 9.25\nLargest of three integers: 35', 'sample'),
  ('9 4 17\n6.75 6.5', 'Larger of two integers: 9\nLarger of two doubles: 6.75\nLargest of three integers: 17', 'sample'),
  ('7 3 5\n1.5 2.5', 'Larger of two integers: 7\nLarger of two doubles: 2.50\nLargest of three integers: 7', 'hidden'),
  ('10 20 30\n8.0 3.5', 'Larger of two integers: 20\nLarger of two doubles: 8.00\nLargest of three integers: 30', 'hidden'),
  ('-5 -9 -2\n-3.25 -7.5', 'Larger of two integers: -5\nLarger of two doubles: -3.25\nLargest of three integers: -2', 'hidden'),
  ('100 250 175\n99.99 100.01', 'Larger of two integers: 250\nLarger of two doubles: 100.01\nLargest of three integers: 250', 'hidden'),
 ],
 'U2_D4': [
  ('50 20 10', 'Booked 20 seats\nBooked 10 seats\nSeats Left: 20', 'sample'),
  ('30 25 10', 'Booked 25 seats\nError: Not enough seats\nSeats Left: 5', 'sample'),
  ('10 10 5', 'Booked 10 seats\nError: Not enough seats\nSeats Left: 0', 'hidden'),
  ('100 40 60', 'Booked 40 seats\nBooked 60 seats\nSeats Left: 0', 'hidden'),
  ('8 9 3', 'Error: Not enough seats\nBooked 3 seats\nSeats Left: 5', 'hidden'),
  ('45 30 20', 'Booked 30 seats\nError: Not enough seats\nSeats Left: 15', 'hidden'),
 ],
 'U2_D5': [
  ('Latha 45000.0 5000.0\nOmar 30000.0', 'Latha: 50000.00\nOmar: 15000.00', 'sample'),
  ('Divya 52000.0 3000.0\nIsha 22000.0', 'Divya: 55000.00\nIsha: 11000.00', 'sample'),
  ('Arun 40000.0 5000.0\nRavi 20000.0', 'Arun: 45000.00\nRavi: 10000.00', 'hidden'),
  ('Meena 55000.5 4500.0\nKiran 18000.0', 'Meena: 59500.50\nKiran: 9000.00', 'hidden'),
  ('Priya 62000.0 8000.5\nSneha 24000.0', 'Priya: 70000.50\nSneha: 12000.00', 'hidden'),
  ('Hari 38000.25 1999.75\nJay 15000.5', 'Hari: 40000.00\nJay: 7500.25', 'hidden'),
 ],
 'U2_C1': [
  ('40000.0 5 2000.0', 'Salary: 40000.00\nPapers: 5\nTotal Pay: 50000.00', 'sample'),
  ('35000.0 3 1500.0', 'Salary: 35000.00\nPapers: 3\nTotal Pay: 39500.00', 'sample'),
  ('30000.0 0 1000.0', 'Salary: 30000.00\nPapers: 0\nTotal Pay: 30000.00', 'hidden'),
  ('45000.5 4 1500.25', 'Salary: 45000.50\nPapers: 4\nTotal Pay: 51001.50', 'hidden'),
  ('60000.0 10 2500.0', 'Salary: 60000.00\nPapers: 10\nTotal Pay: 85000.00', 'hidden'),
  ('52500.75 7 1200.5', 'Salary: 52500.75\nPapers: 7\nTotal Pay: 60904.25', 'hidden'),
 ],
 'U2_C2': [
  ('3\n100 7 5 0 0 3', '100 / 7 = 14\n5 / 0 : Error: Division by zero\n0 / 3 = 0', 'sample'),
  ('2\n7 0 0 0', '7 / 0 : Error: Division by zero\n0 / 0 : Error: Division by zero', 'sample'),
  ('1\n10 2', '10 / 2 = 5', 'hidden'),
  ('2\n9 0 7 7', '9 / 0 : Error: Division by zero\n7 / 7 = 1', 'hidden'),
  ('4\n81 9 6 4 12 0 50 5', '81 / 9 = 9\n6 / 4 = 1\n12 / 0 : Error: Division by zero\n50 / 5 = 10', 'hidden'),
  ('3\n20 4 15 0 9 2', '20 / 4 = 5\n15 / 0 : Error: Division by zero\n9 / 2 = 4', 'hidden'),
 ],
 'U2_C3': [
  ('5\n++-+--', 'Final Score: 5\nHighest Score: 7', 'sample'),
  ('0\n--+', 'Final Score: 1\nHighest Score: 1', 'sample'),
  ('3\n+', 'Final Score: 4\nHighest Score: 4', 'hidden'),
  ('2\n---', 'Final Score: 0\nHighest Score: 2', 'hidden'),
  ('10\n+++---++--+-', 'Final Score: 10\nHighest Score: 13', 'hidden'),
  ('0\n+++++-----------', 'Final Score: 0\nHighest Score: 5', 'hidden'),
 ],
 'U2_C4': [
  ('1 1000.0', 'Method: Card\nFee: 20.00\nTotal: 1020.00\nCard Closed\nPayment Closed', 'sample'),
  ('2 2500.0', 'Method: UPI\nFee: 12.50\nTotal: 2512.50\nUPI Closed\nPayment Closed', 'sample'),
  ('1 500.0', 'Method: Card\nFee: 10.00\nTotal: 510.00\nCard Closed\nPayment Closed', 'hidden'),
  ('2 800.0', 'Method: UPI\nFee: 4.00\nTotal: 804.00\nUPI Closed\nPayment Closed', 'hidden'),
  ('1 1250.5', 'Method: Card\nFee: 25.01\nTotal: 1275.51\nCard Closed\nPayment Closed', 'hidden'),
  ('2 3750.0', 'Method: UPI\nFee: 18.75\nTotal: 3768.75\nUPI Closed\nPayment Closed', 'hidden'),
 ],
}

for k, code in CODE.items():
    with open(f'{S}/{k}.cpp', 'w') as f:
        f.write(code + '\n')
with open(f'{S}/tests_u2.json', 'w') as f:
    json.dump(TESTS, f, indent=1)
print('Unit 2 files written:', len(CODE))
