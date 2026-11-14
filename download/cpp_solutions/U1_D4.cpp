#include <iostream>
#include <string>
using namespace std;
class Student {
    string name;
    int marks;
public:
    Student(string name, int marks) {
        this->name = name;
        this->marks = marks;
    }
    Student& addBonus(int bonus) {
        this->marks = this->marks + bonus;
        return *this;
    }
    void display() {
        cout << "Name: " << this->name << endl;
        cout << "Marks: " << this->marks << endl;
    }
};
int main() {
    string name;
    int marks, b1, b2;
    cin >> name >> marks >> b1 >> b2;
    Student s(name, marks);
    s.addBonus(b1).addBonus(b2);
    s.display();
    return 0;
}
