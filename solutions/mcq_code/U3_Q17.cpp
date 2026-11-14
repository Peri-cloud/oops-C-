#include <iostream>
using namespace std;
struct Node {
    int data;
    Node *next;
};
int main() {
    Node a = {1, NULL}, b = {2, NULL}, c = {3, NULL};
    a.next = &b; b.next = &c; c.next = &a;
    Node *p = &b;
    int count = 0;
    do {
        cout << p->data << " ";
        p = p->next;
        count++;
    } while (p != &b);
    cout << count;
    return 0;
}
