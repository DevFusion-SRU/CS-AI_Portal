// controllers/Notices/notice.js
export const getLatestNotice = async (req, res) => {
    try {
      const notice = await Notice.findOne().sort({ createdAt: -1 });
      if (notice) {
        res.status(200).json({ success: true, data: notice });
      } else {
        res.status(404).json({ success: false, message: "No notices found." });
      }
    } catch (error) {
      console.error("Error fetching latest notice:", error.message);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  };