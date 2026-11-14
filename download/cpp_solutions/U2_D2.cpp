#include <iostream>
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
}
