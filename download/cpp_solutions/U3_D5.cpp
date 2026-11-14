#include <iostream>
using namespace std;
struct Node {
    int data;
    Node* prev;
    Node* next;
};
void insertFront(Node*& head, Node*& tail, int value) {
    Node* newNode = new Node;
    newNode->data = value;
    newNode->prev = NULL;
    newNode->next = head;
    if (head == NULL) {
        tail = newNode;
    } else {
        head->prev = newNode;
    }
    head = newNode;
}
void printForward(Node* head) {
    cout << "Forward:";
    Node* temp = head;
    while (temp != NULL) {
        cout << " " << temp->data;
        temp = temp->next;
    }
    cout << endl;
}
void printBackward(Node* tail) {
    cout << "Backward:";
    Node* temp = tail;
    while (temp != NULL) {
        cout << " " << temp->data;
        temp = temp->prev;
    }
    cout << endl;
}
int main() {
    int n;
    cin >> n;
    Node* head = NULL;
    Node* tail = NULL;
    for (int i = 0; i < n; i++) {
        int value;
        cin >> value;
        insertFront(head, tail, value);
    }
    printForward(head);
    printBackward(tail);
    return 0;
}
