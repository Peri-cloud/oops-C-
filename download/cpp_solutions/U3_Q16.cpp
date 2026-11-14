#include <iostream>
using namespace std;
int main() {
    int s[10], top = -1;
    s[++top] = 2;
    s[++top] = 3;
    s[++top] = 4;
    int b = s[top--];
    int a = s[top--];
    s[++top] = a * b;
    b = s[top--];
    a = s[top--];
    s[++top] = a + b;
    cout << s[top];
    return 0;
}
