#include <iostream>
using namespace std;
struct Node {
    int data;
    Node *next;
};
int main() {
    Node c = {30, NULL};
    Node b = {20, &c};
    Node a = {10, &b};
    int sum = 0;
    for (Node *p = &a; p != NULL; p = p->next)
        sum += p->data;
    cout << sum;
    return 0;
}
