#include <iostream>
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
}
