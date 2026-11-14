#include <iostream>
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
}
