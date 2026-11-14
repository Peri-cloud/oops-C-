#include <iostream>
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
}
