#include <iostream>
#include <string>
using namespace std;
int evaluate(string expr) {
    int stack[50];
    int top = -1;
    for (int i = 0; i < expr.length(); i++) {
        char c = expr[i];
        if (c >= '0' && c <= '9') {
            top = top + 1;
            stack[top] = c - '0';
        } else {
            int b = stack[top];
            top = top - 1;
            int a = stack[top];
            top = top - 1;
            int result = 0;
            if (c == '+') {
                result = a + b;
            } else if (c == '-') {
                result = a - b;
            } else if (c == '*') {
                result = a * b;
            } else {
                result = a / b;
            }
            top = top + 1;
            stack[top] = result;
        }
    }
    return stack[top];
}
int main() {
    string expr;
    cin >> expr;
    cout << "Result: " << evaluate(expr) << endl;
    return 0;
}
