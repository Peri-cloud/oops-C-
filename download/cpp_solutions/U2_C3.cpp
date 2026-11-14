#include <iostream>
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
}
