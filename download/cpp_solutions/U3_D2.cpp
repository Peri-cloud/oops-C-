#include <iostream>
using namespace std;
class CircularQueue {
    int arr[100];
    int capacity;
    int front;
    int rear;
    int count;
public:
    CircularQueue(int c) {
        capacity = c;
        front = 0;
        rear = -1;
        count = 0;
    }
    void process(int type, int value) {
        if (type == 1) {
            if (count == capacity) {
                cout << "Queue Full" << endl;
                return;
            }
            rear = (rear + 1) % capacity;
            arr[rear] = value;
            count = count + 1;
            cout << "Enqueued " << value << endl;
        } else {
            if (count == 0) {
                cout << "Queue Empty" << endl;
                return;
            }
            cout << "Dequeued " << arr[front] << endl;
            front = (front + 1) % capacity;
            count = count - 1;
        }
    }
    void show() {
        if (count == 0) {
            cout << "Queue: Empty" << endl;
            return;
        }
        cout << "Queue:";
        for (int i = 0; i < count; i++) {
            cout << " " << arr[(front + i) % capacity];
        }
        cout << endl;
    }
};
int main() {
    int c, n;
    cin >> c >> n;
    CircularQueue q(c);
    for (int i = 0; i < n; i++) {
        int type, value;
        cin >> type >> value;
        q.process(type, value);
    }
    q.show();
    return 0;
}
