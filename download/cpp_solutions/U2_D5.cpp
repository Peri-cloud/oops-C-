#include <iostream>
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
}
