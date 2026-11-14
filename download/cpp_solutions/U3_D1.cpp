#include <iostream>
using namespace std;
struct Node {
    int data;
    Node* next;
};
Node* insertEnd(Node* head, int value) {
    Node* newNode = new Node;
    newNode->data = value;
    newNode->next = NULL;
    if (head == NULL) {
        return newNode;
    }
    Node* temp = head;
    while (temp->next != NULL) {
        temp = temp->next;
    }
    temp->next = newNode;
    return head;
}
Node* reverseList(Node* head) {
    Node* prev = NULL;
    Node* curr = head;
    while (curr != NULL) {
        Node* nextNode = curr->next;
        curr->next = prev;
        prev = curr;
        curr = nextNode;
    }
    return prev;
}
void display(Node* head) {
    Node* temp = head;
    while (temp != NULL) {
        cout << temp->data;
        if (temp->next != NULL) {
            cout << " ";
        }
        temp = temp->next;
    }
    cout << endl;
}
int main() {
    int n;
    cin >> n;
    Node* head = NULL;
    for (int i = 0; i < n; i++) {
        int value;
        cin >> value;
        head = insertEnd(head, value);
    }
    cout << "Original: ";
    display(head);
    head = reverseList(head);
    cout << "Reversed: ";
    display(head);
    return 0;
}
