#include <iostream>
using namespace std;
struct Node {
    int data;
    Node* next;
};
Node* insertEnd(Node* head, int value) {
    Node* newNode = new Node;
    newNode->data = value;
    if (head == NULL) {
        newNode->next = newNode;
        return newNode;
    }
    Node* temp = head;
    while (temp->next != head) {
        temp = temp->next;
    }
    temp->next = newNode;
    newNode->next = head;
    return head;
}
int valueAfterSteps(Node* head, int steps) {
    Node* temp = head;
    for (int i = 0; i < steps; i++) {
        temp = temp->next;
    }
    return temp->data;
}
int main() {
    int n, steps;
    cin >> n;
    Node* head = NULL;
    for (int i = 0; i < n; i++) {
        int value;
        cin >> value;
        head = insertEnd(head, value);
    }
    cin >> steps;
    cout << "Value After Steps: " << valueAfterSteps(head, steps) << endl;
    return 0;
}
