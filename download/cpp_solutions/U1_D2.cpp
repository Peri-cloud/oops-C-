#include <iostream>
#include <string>
using namespace std;
class Document {
    string title;
    int pages;
public:
    Document(string t, int p) {
        title = t;
        pages = p;
        cout << "Created: " << title << endl;
    }
    Document(Document &other) {
        title = other.title + "_copy";
        pages = other.pages;
        cout << "Copied: " << title << endl;
    }
    void show() {
        cout << "Title: " << title << ", Pages: " << pages << endl;
    }
    ~Document() {
        cout << "Destroyed: " << title << endl;
    }
};
int main() {
    string title;
    int pages;
    cin >> title >> pages;
    Document d1(title, pages);
    Document d2 = d1;
    d1.show();
    d2.show();
    return 0;
}
