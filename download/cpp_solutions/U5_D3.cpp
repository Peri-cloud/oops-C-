#include <iostream>
#include <string>
using namespace std;
int adj[20][20];
int dist[20];
void addEdge(int u, int v) {
    adj[u][v] = 1;
    adj[v][u] = 1;
}
void bfs(int n, int source) {
    int queue[20];
    int front = 0;
    int rear = 0;
    for (int i = 0; i < n; i++) {
        dist[i] = -1;
    }
    dist[source] = 0;
    queue[rear] = source;
    rear = rear + 1;
    while (front < rear) {
        int u = queue[front];
        front = front + 1;
        for (int v = 0; v < n; v++) {
            if (adj[u][v] == 1 && dist[v] == -1) {
                dist[v] = dist[u] + 1;
                queue[rear] = v;
                rear = rear + 1;
            }
        }
    }
}
int main() {
    int n, m, source;
    cin >> n >> m;
    for (int i = 0; i < m; i++) {
        int u, v;
        cin >> u >> v;
        addEdge(u, v);
    }
    cin >> source;
    bfs(n, source);
    for (int i = 0; i < n; i++) {
        cout << "Distance of " << i << ": " << dist[i] << endl;
    }
    return 0;
}
