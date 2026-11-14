#include <iostream>
using namespace std;
int main() {
    int g[5][5] = {{0,1,1,0,0},{1,0,0,0,1},{1,0,0,1,0},{0,0,1,0,1},{0,1,0,1,0}};
    int q[10], front = 0, rear = 0;
    bool visited[5] = {false};
    q[rear++] = 0;
    visited[0] = true;
    while (front < rear) {
        int v = q[front++];
        cout << v << " ";
        for (int i = 0; i < 5; i++)
            if (g[v][i] && !visited[i]) {
                visited[i] = true;
                q[rear++] = i;
            }
    }
    return 0;
}
