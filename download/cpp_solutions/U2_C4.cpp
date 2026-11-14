#include <iostream>
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
}
