#include <iostream>
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
}
