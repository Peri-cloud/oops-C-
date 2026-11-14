#include <iostream>
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
}
