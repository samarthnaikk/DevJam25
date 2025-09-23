# DevJam25 - Docker Automation Quick Start

Welcome to the DevJam25 Docker Automation System! This guide will help you get started quickly.

## 📁 Project Structure

```
DevJam25/
├── DataSet/
│   ├── MiniSet1/          # Your dataset 1
│   └── MiniSet2/          # Your dataset 2
├── Logic/
│   ├── main.py            # Your main application
│   └── requirements.txt   # Python dependencies
├── docker_automation/     # 🤖 Automation system
│   ├── main.py           # Main entry point
│   ├── builder.py        # Image building
│   ├── exporter.py       # Image exporting
│   ├── utils.py          # Utilities
│   ├── config.py         # Configuration
│   ├── test_setup.py     # Setup verification
│   └── README.md         # Detailed documentation
└── exports/              # 📦 Exported tar files
```

## 🚀 Quick Start

### 1. Verify Setup
```bash
cd docker_automation
python test_setup.py
```

### 2. Build All Images
```bash
python main.py --build-all
```

### 3. Export for Distribution
```bash
python main.py --export-all
```

### 4. One-Command Build & Export
```bash
python main.py --build-and-export-all
```

## 📋 Common Commands

| Command | Description |
|---------|-------------|
| `python main.py --help` | Show all available options |
| `python main.py --list-components` | List available MiniSets |
| `python main.py --build Logic` | Build only Logic component |
| `python main.py --export MiniSet1` | Export only MiniSet1 |
| `python main.py --list-images` | Show built images |
| `python main.py --clean-exports` | Clean export directory |

## 🎯 What This System Does

### For You (Main Laptop)
- Builds images with clear names: `dataset-miniset1`, `dataset-miniset2`, `logic-app`
- Keeps your local Docker environment organized

### For Distribution
- Temporarily tags images as `DataSet` during export
- Creates clean tar files: `DataSet_MiniSet1.tar`, `DataSet_Logic.tar`
- Cleans up temporary tags automatically

### For Recipients
- They run: `docker load -i DataSet_MiniSet1.tar`
- They see: A clean image named `DataSet`
- No confusing names or version conflicts

## 🔧 Adding New MiniSets

Just create a new folder in `DataSet/` (e.g., `MiniSet3/`) and the system will automatically detect it!

## 📖 Need More Details?

Check out the comprehensive documentation:
- `docker_automation/README.md` - Full documentation
- Run `python main.py --help` - CLI help

## 🆘 Troubleshooting

1. **Docker not running**: Start Docker Desktop
2. **Permission errors**: Make sure Docker is properly installed
3. **Build failures**: Check with `--log-level DEBUG`

---

Happy automating! 🐳✨