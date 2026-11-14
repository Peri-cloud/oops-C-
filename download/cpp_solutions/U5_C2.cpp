#include <iostream>
using namespace std;
int main() {
    int n, m;
    cin >> n >> m;
    int adj[20][20];
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            adj[i][j] = 0;
        }
    }
    for (int i = 0; i < m; i++) {
        int u, v;
        cin >> u >> v;
        adj[u][v] = 1;
        adj[v][u] = 1;
    }
    int color[20];
    for (int i = 0; i < n; i++) {
        color[i] = -1;
    }
    for (int start = 0; start < n; start++) {
        if (color[start] != -1) {
            continue;
        }
        int queue[20];
        int front = 0;
        int rear = 0;
        color[start] = 0;
        queue[rear] = start;
        rear = rear + 1;
        while (front < rear) {
            int u = queue[front];
            front = front + 1;
            for (int v = 0; v < n; v++) {
                if (adj[u][v] == 1) {
                    if (color[v] == -1) {
                        color[v] = 1 - color[u];
                        queue[rear] = v;
                        rear = rear + 1;
                    } else if (color[v] == color[u]) {
                        cout << "Not Possible" << endl;
                        return 0;
                    }
                }
            }
        }
    }
    cout << "Possible" << endl;
    cout << "Team A:";
    for (int i = 0; i < n; i++) {
        if (color[i] == 0) {
            cout << " " << i;
        }
    }
    cout << endl;
    cout << "Team B:";
    for (int i = 0; i < n; i++) {
        if (color[i] == 1) {
            cout << " " << i;
        }
    }
    cout << endl;
    return 0;
}
