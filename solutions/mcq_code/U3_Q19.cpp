#include <iostream>
using namespace std;
struct Node {
    int data;
    Node *prev, *next;
};
int main() {
    Node a = {1, NULL, NULL}, b = {2, NULL, NULL}, c = {3, NULL, NULL};
    a.next = &b; b.prev = &a;
    b.next = &c; c.prev = &b;
    Node *p = &c;
    while (p != NULL) {
        cout << p->data << " ";
        p = p->prev;
    }
    return 0;
}
