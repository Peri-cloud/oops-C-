#include <iostream>
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
}
