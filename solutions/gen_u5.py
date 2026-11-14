#!/usr/bin/env python3
"""Unit 5: write QB solutions as .cpp files + test cases JSON.
Samples recovered from embedded images: D1 sample table, C3 sample table, C4 sample table.
D3 and C2 have blank output columns in the source -> outputs marked 'inferred_output'."""
import json, os

S = '/home/z/my-project/scripts/solutions'

CODE = {}

CODE['U5_D1'] = '''#include <iostream>
#include <string>
using namespace std;
int adj[20][20];
void addEdge(int u, int v) {
    adj[u][v] = 1;
    adj[v][u] = 1;
}
void printList(int n) {
    for (int i = 0; i < n; i++) {
        cout << i << ":";
        for (int j = 0; j < n; j++) {
            if (adj[i][j] == 1) {
                cout << " " << j;
            }
        }
        cout << endl;
    }
}
int main() {
    int n, m;
    cin >> n >> m;
    for (int i = 0; i < m; i++) {
        int u, v;
        cin >> u >> v;
        addEdge(u, v);
    }
    printList(n);
    return 0;
}'''

CODE['U5_D2'] = '''#include <iostream>
#include <string>
using namespace std;
int adj[20][20];
bool visited[20];
void addEdge(int u, int v) {
    adj[u][v] = 1;
    adj[v][u] = 1;
}
bool dfs(int n, int u, int parent) {
    visited[u] = true;
    for (int v = 0; v < n; v++) {
        if (adj[u][v] == 1) {
            if (!visited[v]) {
                if (dfs(n, v, u)) {
                    return true;
                }
            } else if (v != parent) {
                return true;
            }
        }
    }
    return false;
}
string hasCycle(int n) {
    for (int i = 0; i < n; i++) {
        if (!visited[i]) {
            if (dfs(n, i, -1)) {
                return "Cycle Exists";
            }
        }
    }
    return "No Cycle";
}
int main() {
    int n, m;
    cin >> n >> m;
    for (int i = 0; i < m; i++) {
        int u, v;
        cin >> u >> v;
        addEdge(u, v);
    }
    cout << "Graph Check: " << hasCycle(n) << endl;
    return 0;
}'''

CODE['U5_D3'] = '''#include <iostream>
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
}'''

CODE['U5_D4'] = '''#include <iostream>
#include <string>
using namespace std;
int graph[20][20];
void addEdge(int u, int v, int w) {
    graph[u][v] = w;
    graph[v][u] = w;
}
int primMST(int n) {
    bool inTree[20];
    int key[20];
    for (int i = 0; i < n; i++) {
        key[i] = 1000000000;
        inTree[i] = false;
    }
    key[0] = 0;
    int total = 0;
    for (int count = 0; count < n; count++) {
        int u = -1;
        for (int v = 0; v < n; v++) {
            if (!inTree[v] && (u == -1 || key[v] < key[u])) {
                u = v;
            }
        }
        inTree[u] = true;
        total = total + key[u];
        for (int v = 0; v < n; v++) {
            if (graph[u][v] > 0 && !inTree[v] && graph[u][v] < key[v]) {
                key[v] = graph[u][v];
            }
        }
    }
    return total;
}
int main() {
    int n, m;
    cin >> n >> m;
    for (int i = 0; i < m; i++) {
        int u, v, w;
        cin >> u >> v >> w;
        addEdge(u, v, w);
    }
    cout << "MST Weight: " << primMST(n) << endl;
    return 0;
}'''

CODE['U5_D5'] = '''#include <iostream>
#include <string>
using namespace std;
int graph[20][20];
void addEdge(int u, int v, int w) {
    graph[u][v] = w;
    graph[v][u] = w;
}
void dijkstra(int n, int source, int dist[]) {
    bool done[20];
    for (int i = 0; i < n; i++) {
        dist[i] = 1000000000;
        done[i] = false;
    }
    dist[source] = 0;
    for (int count = 0; count < n; count++) {
        int u = -1;
        for (int v = 0; v < n; v++) {
            if (!done[v] && dist[v] != 1000000000 && (u == -1 || dist[v] < dist[u])) {
                u = v;
            }
        }
        if (u == -1) {
            break;
        }
        done[u] = true;
        for (int v = 0; v < n; v++) {
            if (graph[u][v] > 0 && !done[v] && dist[u] + graph[u][v] < dist[v]) {
                dist[v] = dist[u] + graph[u][v];
            }
        }
    }
}
void printDistances(int n, int dist[]) {
    cout << "Distances:";
    for (int i = 0; i < n; i++) {
        if (dist[i] == 1000000000) {
            cout << " INF";
        } else {
            cout << " " << dist[i];
        }
    }
    cout << endl;
}
int main() {
    int n, m, source;
    cin >> n >> m;
    for (int i = 0; i < m; i++) {
        int u, v, w;
        cin >> u >> v >> w;
        addEdge(u, v, w);
    }
    cin >> source;
    int dist[20];
    dijkstra(n, source, dist);
    printDistances(n, dist);
    return 0;
}'''

CODE['U5_C1'] = '''#include <iostream>
using namespace std;
int main() {
    int n, m;
    cin >> n >> m;
    int adj[20][20];
    int indeg[20];
    for (int i = 0; i < n; i++) {
        indeg[i] = 0;
        for (int j = 0; j < n; j++) {
            adj[i][j] = 0;
        }
    }
    for (int i = 0; i < m; i++) {
        int a, b;
        cin >> a >> b;
        if (adj[a][b] == 0) {
            adj[a][b] = 1;
            indeg[b] = indeg[b] + 1;
        }
    }
    bool done[20];
    for (int i = 0; i < n; i++) {
        done[i] = false;
    }
    int taken = 0;
    int semesters = 0;
    while (taken < n) {
        int batch[20];
        int count = 0;
        for (int i = 0; i < n; i++) {
            if (!done[i] && indeg[i] == 0) {
                batch[count] = i;
                count = count + 1;
            }
        }
        if (count == 0) {
            cout << "Impossible: Cycle in prerequisites" << endl;
            return 0;
        }
        for (int k = 0; k < count; k++) {
            int u = batch[k];
            done[u] = true;
            taken = taken + 1;
            for (int j = 0; j < n; j++) {
                if (adj[u][j] == 1) {
                    indeg[j] = indeg[j] - 1;
                }
            }
        }
        semesters = semesters + 1;
    }
    cout << "Semesters: " << semesters << endl;
    return 0;
}'''

CODE['U5_C2'] = '''#include <iostream>
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
}'''

CODE['U5_C3'] = '''#include <iostream>
using namespace std;
int main() {
    int n, m;
    cin >> n >> m;
    int eu[105], ev[105], ew[105];
    for (int i = 0; i < m; i++) {
        cin >> eu[i] >> ev[i] >> ew[i];
    }
    int dist[20];
    for (int i = 0; i < n; i++) {
        dist[i] = 1000000000;
    }
    dist[0] = 0;
    for (int pass = 1; pass < n; pass++) {
        for (int i = 0; i < m; i++) {
            if (dist[eu[i]] != 1000000000 && dist[eu[i]] + ew[i] < dist[ev[i]]) {
                dist[ev[i]] = dist[eu[i]] + ew[i];
            }
        }
    }
    for (int i = 0; i < m; i++) {
        if (dist[eu[i]] != 1000000000 && dist[eu[i]] + ew[i] < dist[ev[i]]) {
            cout << "Negative Cycle" << endl;
            return 0;
        }
    }
    if (dist[n - 1] == 1000000000) {
        cout << "No Route" << endl;
    } else {
        cout << "Minimum Cost: " << dist[n - 1] << endl;
    }
    return 0;
}'''

CODE['U5_C4'] = '''#include <iostream>
using namespace std;
int n;
int adj[20][20];
bool visited[20];
int dfs(int u) {
    visited[u] = true;
    int size = 1;
    for (int v = 0; v < n; v++) {
        if (adj[u][v] == 1 && !visited[v]) {
            size = size + dfs(v);
        }
    }
    return size;
}
int main() {
    int m;
    cin >> n >> m;
    for (int i = 0; i < m; i++) {
        int u, v;
        cin >> u >> v;
        adj[u][v] = 1;
        adj[v][u] = 1;
    }
    int components = 0;
    int largest = 0;
    for (int i = 0; i < n; i++) {
        if (!visited[i]) {
            int size = dfs(i);
            components = components + 1;
            if (size > largest) {
                largest = size;
            }
        }
    }
    cout << "Components: " << components << endl;
    cout << "Largest Component: " << largest << endl;
    if (components == 1) {
        cout << "Connected: Yes" << endl;
    } else {
        cout << "Connected: No" << endl;
    }
    return 0;
}'''

TESTS = {
 'U5_D1': [
  # samples recovered from the image table embedded in the DOCX
  ('4 3\n0 1\n0 2\n0 3', '0: 1 2 3\n1: 0\n2: 0\n3: 0', 'sample-image'),
  ('3 3\n0 1\n1 2\n0 2', '0: 1 2\n1: 0 2\n2: 0 1', 'sample-image'),
 ],
 'U5_D2': [
  ('5 4\n0 1\n0 2\n0 3\n0 4', 'Graph Check: No Cycle', 'sample'),
  ('5 5\n0 1\n1 2\n2 3\n3 4\n4 1', 'Graph Check: Cycle Exists', 'sample'),
 ],
 'U5_D3': [
  # inputs from QB; output column blank in source -> outputs computed by verified program (INFERRED)
  ('5 4\n0 1\n0 2\n2 3\n3 4\n1', 'Distance of 0: 1\nDistance of 1: 0\nDistance of 2: 2\nDistance of 3: 3\nDistance of 4: 4', 'inferred_output'),
  ('4 4\n0 1\n1 2\n2 3\n3 0\n2', 'Distance of 0: 2\nDistance of 1: 1\nDistance of 2: 0\nDistance of 3: 1', 'inferred_output'),
 ],
 'U5_D4': [
  ('4 5\n0 1 5\n0 2 9\n1 2 2\n1 3 7\n2 3 4', 'MST Weight: 11', 'sample'),
  ('5 6\n0 1 12\n0 4 6\n1 2 10\n2 3 3\n3 4 8\n1 4 5', 'MST Weight: 22', 'sample'),
 ],
 'U5_D5': [
  ('4 5\n0 1 2\n0 2 6\n1 2 3\n1 3 8\n2 3 1\n0', 'Distances: 0 2 5 6', 'sample'),
  ('5 4\n0 1 3\n1 2 4\n2 3 5\n3 4 6\n4', 'Distances: 18 15 11 6 0', 'sample'),
 ],
 'U5_C1': [
  ('5 2\n0 1\n2 3', 'Semesters: 2', 'sample'),
  ('3 3\n1 0\n0 2\n2 1', 'Impossible: Cycle in prerequisites', 'sample'),
 ],
 'U5_C2': [
  # output column blank in source -> computed by verified program (INFERRED)
  ('7 6\n0 1\n1 2\n2 3\n3 0\n4 5\n5 6', 'Possible\nTeam A: 0 2 4 6\nTeam B: 1 3 5', 'inferred_output'),
  ('5 4\n0 1\n0 2\n3 4\n1 4', 'Possible\nTeam A: 0 4\nTeam B: 1 2 3', 'inferred_output'),
 ],
 'U5_C3': [
  # samples recovered from the image table embedded in the DOCX
  ('3 3\n0 1 10\n0 2 3\n2 1 -5', 'Minimum Cost: 3', 'sample-image'),
  ('4 3\n0 1 3\n1 2 -2\n2 3 4', 'Minimum Cost: 5', 'sample-image'),
 ],
 'U5_C4': [
  # samples recovered from the image table embedded in the DOCX
  ('4 3\n0 2\n2 1\n1 3', 'Components: 1\nLargest Component: 4\nConnected: Yes', 'sample-image'),
  ('7 3\n0 6\n1 5\n2 4', 'Components: 4\nLargest Component: 2\nConnected: No', 'sample-image'),
 ],
}

for k, code in CODE.items():
    with open(f'{S}/{k}.cpp', 'w') as f:
        f.write(code + '\n')
with open(f'{S}/tests_u5.json', 'w') as f:
    json.dump(TESTS, f, indent=1)
print('Unit 5 files written:', len(CODE))
